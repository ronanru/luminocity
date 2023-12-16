import type { Comment } from "@/app/(app)/posts/[postId]/commentSection";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { type db as database } from "@/server/db";
import { commentVotes, comments } from "@/server/db/schema";
import { clerkClient } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";

/** a recursive function to load a part of a comment tree  */
const loadComments = async (
  db: typeof database,
  {
    userId,
    parentId,
    postId,
    skip = 0,
    take = 1,
  }: {
    userId: string | null;
    parentId: string | null;
    postId: string;
    take?: number;
    skip?: number;
  },
): Promise<{ children: Comment[]; hasMoreChildren: boolean }> => {
  const data = await db
    .select({
      id: comments.id,
      text: comments.text,
      score: comments.score,
      createdAt: comments.createdAt,
      userId: comments.userId,
      ...(userId
        ? {
            vote: sql`(SELECT ${
              commentVotes.isUpvote
            } FROM ${commentVotes} WHERE ${and(
              eq(commentVotes.userId, userId),
              eq(commentVotes.commentId, comments.id),
            )} LIMIT 1)`,
          }
        : {}),
    })
    .from(comments)
    .where(
      and(
        parentId === null
          ? isNull(comments.parentId)
          : eq(comments.parentId, parentId),
        eq(comments.postId, postId),
      ),
    )
    .orderBy(asc(comments.createdAt))
    .offset(skip)
    .limit(take + 1)
    .execute();
  if (!data[0]) {
    return {
      children: [],
      hasMoreChildren: false,
    };
  }

  const children = await Promise.all(
    data.slice(0, take).map(async (dbComment) => {
      const [user, childrenData] = await Promise.all([
        clerkClient.users.getUser(dbComment.userId),
        loadComments(db, {
          userId,
          parentId: dbComment.id,
          postId,
          skip: 0,
          take: 1,
        }),
      ]);
      return {
        ...dbComment,
        ...childrenData,
        vote: !userId || dbComment.vote === null ? null : Boolean(dbComment),
        user: {
          username: user.username,
          imageUrl: user.imageUrl,
        },
      };
    }),
  );

  return {
    children,
    hasMoreChildren: data.length === take + 1,
  };
};

export const commentRouter = createTRPCRouter({
  getByParentId: publicProcedure
    .input(
      z.object({
        postId: z.string().cuid2(),
        parentId: z.string().cuid2().nullable(),
        skip: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) =>
      loadComments(ctx.db, {
        userId: ctx.auth.userId,
        parentId: input.parentId,
        postId: input.postId,
        skip: input.skip,
        take: 5,
      }),
    ),
  create: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid2(),
        parentId: z.string().cuid2().nullable(),
        text: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = createId();
      await ctx.db
        .insert(comments)
        .values({
          postId: input.postId,
          parentId: input.parentId,
          text: input.text,
          userId: ctx.auth.userId,
          id,
        })
        .execute();
      return await ctx.db.query.comments.findFirst({
        where: eq(comments.id, id),
      });
    }),
  setVote: protectedProcedure
    .input(
      z.object({
        commentId: z.string().cuid2(),
        vote: z.boolean().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentVote = await ctx.db.query.commentVotes.findFirst({
        where: and(
          eq(commentVotes.commentId, input.commentId),
          eq(commentVotes.userId, ctx.auth.userId),
        ),
        columns: {
          isUpvote: true,
        },
      });
      if (currentVote) {
        await ctx.db.transaction(async (tx) => {
          await tx
            .delete(commentVotes)
            .where(
              and(
                eq(commentVotes.commentId, input.commentId),
                eq(commentVotes.userId, ctx.auth.userId),
              ),
            );
          await tx
            .update(comments)
            .set({
              score: sql`${comments.score} + ${currentVote.isUpvote ? -1 : 1}`,
            })
            .where(eq(comments.id, input.commentId));
        });
      }
      if (input.vote !== null) {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(commentVotes).values({
            isUpvote: input.vote!,
            commentId: input.commentId,
            userId: ctx.auth.userId,
          });
          await tx
            .update(comments)
            .set({
              score: sql`${comments.score} + ${input.vote ? 1 : -1}`,
            })
            .where(eq(comments.id, input.commentId));
        });
      }
      const comment = await ctx.db.query.comments.findFirst({
        where: eq(comments.id, input.commentId),
        columns: {
          score: true,
        },
      });
      return comment?.score ?? 0;
    }),
});
