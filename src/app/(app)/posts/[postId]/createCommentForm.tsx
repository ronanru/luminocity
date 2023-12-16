"use client";

import { Form } from "@/components/form";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { type Comment } from "./commentSection";

export const CreateCommentForm = ({
  parentId,
  postId,
  onComment,
}: {
  parentId: string | null;
  postId: string;
  onComment?: (comment: Comment) => void;
}) => {
  const { user } = useUser();

  const createCommentMutation = api.comment.create.useMutation({
    onSuccess: (newComment) => {
      if (!newComment || !user) return;
      onComment?.({
        ...newComment,
        user: {
          imageUrl: user.imageUrl,
          username: user.username,
        },
        children: [],
        hasMoreChildren: false,
        vote: null,
      });
    },
  });

  return (
    <Form
      submitText="Comment"
      isSubmitting={createCommentMutation.isLoading}
      onSubmit={(e) => {
        e.preventDefault();
        if (createCommentMutation.isLoading) return;
        const formData = new FormData(e.currentTarget);
        createCommentMutation.mutate({
          text: formData.get("text") as string,
          parentId,
          postId,
        });
        e.currentTarget.reset();
      }}
    >
      <input
        type="text"
        name="text"
        className="placeholder:text-gray-500 text-gray-800"
        placeholder="Comment your thoughts"
        min={3}
        max={1024}
      />
    </Form>
  );
};
