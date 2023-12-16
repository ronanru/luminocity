"use client";

import { Button } from "@/components/ui/button";
import type { Comment as DBComment } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { useAuth } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/server";
import { Fragment, useEffect, useState } from "react";
import { CommentComponent } from "./comment";
import { CreateCommentForm } from "./createCommentForm";

export type Comment = Omit<DBComment, "parentId" | "postId"> & {
  user: Pick<User, "imageUrl" | "username">;
  vote: boolean | null;
  children: Comment[];
  hasMoreChildren: boolean;
};

export const CommentSection = ({
  postId,
  initialChildren,
  initialHasMoreChildren,
}: {
  postId: string;
  initialChildren: Comment[];
  initialHasMoreChildren: boolean;
}) => {
  const { isSignedIn } = useAuth();
  const [children, setChildren] = useState(initialChildren);

  return (
    <>
      {isSignedIn && (
        <CreateCommentForm
          parentId={null}
          postId={postId}
          onComment={(comment) => {
            setChildren((prev) => [comment, ...prev]);
          }}
        />
      )}
      {children.length > 0 && (
        <>
          <div className="h-px w-full bg-border" />
          <h2 className="text-gray-800 text-sm font-medium leading-tight">
            All comments
          </h2>
          <CommentList
            initialChildren={children}
            initialHasMoreChildren={initialHasMoreChildren}
            parentId={null}
            postId={postId}
          />
        </>
      )}
    </>
  );
};

export const CommentList = ({
  postId,
  initialChildren,
  initialHasMoreChildren,
  parentId,
}: {
  postId: string;
  parentId: string | null;
  initialHasMoreChildren: boolean;
  initialChildren: Comment[];
}) => {
  const { client } = api.useUtils();
  const [children, setChildren] = useState(initialChildren);
  const [hasMoreChildren, setHasMoreChildren] = useState(
    initialHasMoreChildren,
  );
  const loadMore = async () => {
    if (!hasMoreChildren) return;
    await client.comment.getByParentId
      .query({
        parentId,
        postId,
        skip: children.length,
      })
      .then((result) => {
        setChildren((prev) => [...prev, ...result.children]);
        setHasMoreChildren(result.hasMoreChildren);
      });
  };

  useEffect(() => {
    setChildren(initialChildren);
    setHasMoreChildren(initialHasMoreChildren);
  }, [initialChildren, initialHasMoreChildren]);

  if (children.length === 0) return null;

  return (
    <>
      {children.map((comment) => (
        <Fragment key={comment.id}>
          <CommentComponent {...comment} postId={postId} />
          {parentId === null && <div className="h-px w-full bg-border" />}
        </Fragment>
      ))}
      {hasMoreChildren && (
        <Button variant="secondary" size="sm" onClick={loadMore}>
          Load more
        </Button>
      )}
    </>
  );
};
