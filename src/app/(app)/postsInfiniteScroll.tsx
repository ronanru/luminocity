"use client";

import { Post } from "@/components/post";
import { ScrollDetector } from "@/components/scrollDetector";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { useAuth } from "@clerk/nextjs";
import { CreatePostForm } from "./createPostForm";

export const PostsInfiniteScroll = ({
  onlyMine,
  firstPage,
}: {
  onlyMine?: boolean;
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

  const { userId } = useAuth();
  return (
    <div className="pt-4">
      {userId !== null && <CreatePostForm />}
      {[
        ...firstPage,
        ...(query.data?.pages.flatMap((page) => page.posts) ?? []),
      ].map((post) => (
        <Post isLink {...post} key={post.id} />
      ))}
      <ScrollDetector
        onInScroll={async () => {
          query.hasNextPage && (await query.fetchNextPage());
        }}
      />
    </div>
  );
};
