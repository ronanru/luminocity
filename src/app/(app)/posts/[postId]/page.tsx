import { BackButton } from "@/components/backButton";
import { Post } from "@/components/post";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { CommentSection } from "./commentSection";

export default async function PostPage({
  params,
}: {
  params: {
    postId: string;
  };
}) {
  const [post, { children, hasMoreChildren }] = await Promise.all([
    api.post.getById.query(params.postId),
    api.comment.getByParentId.query({
      parentId: null,
      postId: params.postId,
      skip: 0,
    }),
  ]);
  if (!post) throw notFound();
  return (
    <div className="flex flex-col gap-6">
      <BackButton href="/" text="Back to posts" />
      <Post {...post} />
      <CommentSection
        initialChildren={children}
        initialHasMoreChildren={hasMoreChildren}
        postId={params.postId}
      />
    </div>
  );
}
