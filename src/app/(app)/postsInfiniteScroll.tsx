"use client";

import { Post } from "@/components/post";
import { ScrollDetector } from "@/components/scrollDetector";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useAuth } from "@clerk/nextjs";
import { Fragment } from "react";
import { CreatePostForm } from "./createPostForm";

export const PostsInfiniteScroll = ({
  onlyMine,
  firstPage,
}: {
  onlyMine: boolean;
  firstPage: RouterOutputs["post"]["getAll"]["posts"];
}) => {
  // const utils = api.useUtils();
  const query = api.post.getAll.useInfiniteQuery(
    {
      onlyMine,
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.posts.length ? lastPage.cursor + 1 : null,
      getPreviousPageParam: (lastPage) =>
        lastPage.cursor > 0 ? lastPage.cursor - 1 : null,
      initialCursor: 1,
    },
  );

  const { isSignedIn } = useAuth();
  return (
    <div className="-mt-6">
      {isSignedIn && (
        <div className="pt-10">
          <CreatePostForm />
        </div>
      )}
      {[
        ...firstPage,
        ...(query.data?.pages.flatMap((page) => page.posts) ?? []),
      ].map((post) => (
        <Fragment key={post.id}>
          <div className="py-10">
            <Post isLink {...post} />
          </div>
          <div className="h-px w-full bg-border"></div>
        </Fragment>
      ))}
      <ScrollDetector
        onInView={async () => {
          query.hasNextPage && (await query.fetchNextPage());
        }}
      />
    </div>
  );
};
