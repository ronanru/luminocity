"use client";

import { Form } from "@/components/form";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Textarea from "react-textarea-autosize";

export const CreatePostForm = () => {
  const utils = api.useUtils();
  const router = useRouter();
  const createPostMutation = api.post.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      await utils.post.getAll.invalidate();
    },
  });

  return (
    <Form
      submitText="Post"
      isSubmitting={createPostMutation.isLoading}
      onSubmit={(e) => {
        e.preventDefault();
        if (createPostMutation.isLoading) return;
        const formData = new FormData(e.currentTarget);
        createPostMutation.mutate({
          title: formData.get("title") as string,
          text: formData.get("text") as string,
        });
        e.currentTarget.reset();
      }}
    >
      <input
        type="text"
        name="title"
        placeholder="Title of your post"
        maxLength={256}
        minLength={3}
        className="placeholder:text-gray-500"
      />
      <Textarea
        className="resize-none placeholder:text-gray-500"
        name="text"
        placeholder="Share your thoughts with the world!"
        minRows={1}
        rows={1}
        maxRows={5}
        minLength={8}
        maxLength={1024}
      />
    </Form>
  );
};
