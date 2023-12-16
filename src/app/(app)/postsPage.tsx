import { api } from "@/trpc/server";
import { PostsInfiniteScroll } from "./postsInfiniteScroll";

export const PostsPage = async ({ onlyMine }: { onlyMine: boolean }) => {
  // SSR the first 20 posts
  const firstPage = await api.post.getAll.query({ onlyMine, cursor: 0 });
  return (
    <PostsInfiniteScroll firstPage={firstPage.posts} onlyMine={onlyMine} />
  );
};
