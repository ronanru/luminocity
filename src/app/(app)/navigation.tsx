"use client";

import { HomeIcon } from "@/components/icons/home";
import { LogInIcon } from "@/components/icons/logIn";
import { MyPostsIcon } from "@/components/icons/myPosts";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Link = {
  icon: React.FC;
  name: string;
  path: string;
};

export const Navigation = () => {
  const { isSignedIn } = useAuth();
  const links: Link[] = [
    {
      icon: HomeIcon,
      name: "Home",
      path: "/",
    },
    isSignedIn
      ? {
          icon: MyPostsIcon,
          name: "My Posts",
          path: "/my-posts",
        }
      : {
          icon: LogInIcon,
          name: "Log In",
          path: "/sign-in",
        },
  ];
  return (
    <>
      <SideBar links={links} />
      <MobileNav links={links} />
    </>
  );
};

const SideBar = ({ links }: { links: Link[] }) => {
  const pathname = usePathname();
  const currentLinkIndex = links.findIndex(({ path }) => path === pathname);
  const [highlightedLinkIndex, setHighlightedLinkIndex] =
    useState(currentLinkIndex);
  return (
    <div className="fixed inset-y-0 left-0 border-r py-6 pl-4 pr-5 gap-1 hidden xl:flex flex-col">
      <div className="flex flex-col overflow-hidden gap-1 [contain:paint]">
        {links.map(({ icon: Icon, name, path }, i) => (
          <Link
            href={path}
            key={path}
            onMouseOut={() => setHighlightedLinkIndex(currentLinkIndex)}
            onMouseOver={() => setHighlightedLinkIndex(i)}
            className={twMerge(
              "w-60 h-12 flex gap-4 font-medium rounded-lg px-4 py-3 text-gray-700 transition-colors",
              path === pathname && "text-indigo-600",
            )}
          >
            <Icon /> {name}
          </Link>
        ))}
        <div
          className="absolute w-60 bg-gray-50 h-12 rounded-lg top-6 -z-10 transition-transform"
          style={{
            transform: `translateY(${highlightedLinkIndex * 3.25 - 1.5}rem)`,
          }}
        />
      </div>
      <div className="flex-1" />
      <div>
        <UserButton
          afterSignOutUrl="/"
          showName={true}
          appearance={{
            elements: {
              userButtonBox: "flex-row-reverse gap-4 px-4 py-3 w-full",
              userButtonOuterIdentifier: "text-gray-700",
            },
          }}
        />
      </div>
    </div>
  );
};

const MobileNav = ({ links }: { links: Link[] }) => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  return (
    <div className="border-t">
      <nav className="xl:hidden h-20 mx-auto max-w-[648px] grid grid-cols-[repeat(auto-fit,_minmax(0px,_1fr))]">
        {links.map(({ icon: Icon, name, path }) => (
          <Link
            href={path}
            key={path}
            className={twMerge(
              "flex flex-col items-center justify-center gap-2 font-medium text-gray-700 transition-colors",
              path === pathname && "text-indigo-600 bg-gray-50",
            )}
          >
            <Icon /> {name}
          </Link>
        ))}
        {isSignedIn && (
          <button
            onClick={({ target }) =>
              (target as HTMLElement)
                .querySelector<HTMLButtonElement>(".cl-userButtonTrigger")
                ?.click()
            }
            className="flex flex-col gap-2 px-4 py-3 w-full text-center items-center justify-center font-medium text-gray-700 transition-colors"
          >
            <div className="h-5 w-5">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-5 h-5",
                  },
                }}
              />
            </div>
            My Account
          </button>
        )}
      </nav>
    </div>
  );
};
