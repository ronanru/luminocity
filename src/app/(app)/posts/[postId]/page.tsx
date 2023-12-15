import { BackButton } from "@/components/backButton";
import { Form } from "@/components/form";
import { Post } from "@/components/post";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: {
    postId: string;
  };
}) {
  const post = await api.post.getById.query(params.postId);
  if (!post) throw notFound();
  return (
    <div className="flex flex-col gap-6">
      <BackButton href="/" text="Back to posts" />
      <Post {...post} />
      <Form submitText="Comment" isSubmitting={false}>
        <input
          type="text"
          className="placeholder:text-gray-500"
          placeholder="Comment your thoughts"
        />
      </Form>
      <div className="h-px w-full bg-border" />
    </div>
  );
}
