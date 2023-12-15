"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import { type ComponentProps } from "react";

export const Form = ({
  children,
  submitText,
  isSubmitting,
  ...props
}: {
  children: React.ReactNode | React.ReactNode[];
  isSubmitting: boolean;
  submitText: string;
} & ComponentProps<"form">) => {
  const { user } = useUser();
  return (
    <form
      className="px-4 pt-4 pb-3 flex gap-4 rounded-xl border shadow"
      {...props}
    >
      <div>
        {user ? (
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback>{user.username?.[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="w-6 h-6 rounded-full" />
        )}
      </div>
      <div className="grid gap-3 flex-1">
        {children}
        <div className="w-full h-px bg-border"></div>
        <div className="flex justify-end">
          <Button disabled={isSubmitting}>{submitText}</Button>
        </div>
      </div>
    </form>
  );
};
