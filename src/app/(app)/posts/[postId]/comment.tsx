"use client";

import { ReplyIcon } from "@/components/icons/reply";
import { ProtectedButton } from "@/components/protectedButton";
import { ScoreDisplay } from "@/components/scoreDisplay";
import { Time } from "@/components/time";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapse } from "@chakra-ui/transition";
import { useAuth } from "@clerk/nextjs";
import { useId, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CommentList, type Comment } from "./commentSection";
import { CreateCommentForm } from "./createCommentForm";

export const CommentComponent = ({
  children: initialChildren,
  createdAt,
  hasMoreChildren,
  id,
  text,
  user,
  postId,
  score,
  vote,
}: Comment & {
  postId: string;
}) => {
  const { isSignedIn } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [children, setChildren] = useState<Comment[]>(initialChildren);
  const commentFormContainerId = useId();

  return (
    <div key={id} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Avatar className="w-6 h-6">
          <AvatarFallback>{user.username?.[0]}</AvatarFallback>
          <AvatarImage src={user.imageUrl} />
        </Avatar>
        <span className="text-gray-600 text-sm leading-tight">
          {user.username} <Time date={createdAt} />
        </span>
      </div>
      <p className="whitespace-pre-wrap text-gray-800 text-sm leading-tight">
        {text}
      </p>
      <div className="flex gap-4">
        <ScoreDisplay commentId={id} for="comment" score={score} vote={vote} />
        <ProtectedButton
          className={twMerge(
            "flex gap-2 text-gray-700 text-sm leading-tight items-center transition-colors hover:text-gray-800",
            isFormOpen && "text-indigo-600 hover:text-indigo-700",
          )}
          aria-expanded={
            isSignedIn ? (isFormOpen ? "true" : "false") : undefined
          }
          aria-controls={isFormOpen ? commentFormContainerId : undefined}
          onClick={() => setIsFormOpen((prev) => !prev)}
        >
          <ReplyIcon className="w-4 h-4" /> Reply
        </ProtectedButton>
      </div>
      <Collapse in={isFormOpen} id={commentFormContainerId} className="-mb-3">
        <div className="pb-3">
          <CreateCommentForm
            parentId={id}
            postId={postId}
            onComment={(comment) => {
              setChildren((prev) => [comment, ...prev]);
              setIsFormOpen(false);
            }}
          />
        </div>
      </Collapse>
      {children.length > 0 && (
        <div className="pl-8 gap-6 flex flex-col pt-4">
          <CommentList
            initialChildren={children}
            initialHasMoreChildren={hasMoreChildren}
            parentId={id}
            postId={postId}
          />
        </div>
      )}
    </div>
  );
};
