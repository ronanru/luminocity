import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { postVotes, posts, type Post } from "@/server/db/schema";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        onlyMine: z.boolean().optional(),
        cursor: z.number().nullish(),
      }),
    )
    .query(
      async ({
        ctx,
        input,
      }): Promise<{
        cursor: number;
        posts: (Post & {
          user: Pick<User, "imageUrl" | "username">;
          vote?: boolean | null;
        })[];
      }> => {
        if (input.onlyMine && !ctx.auth.userId) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        const cursor = input.cursor ?? 0;
        const data = (await ctx.db
          .select({
            score: posts.score,
            id: posts.id,
            title: posts.title,
            text: posts.text,
            userId: posts.userId,
            createdAt: posts.createdAt,
            ...(ctx.auth.userId
              ? {
                  vote: sql`(SELECT ${
                    postVotes.isUpvote
                  } FROM ${postVotes} WHERE ${and(
                    eq(postVotes.userId, ctx.auth.userId),
                    eq(postVotes.postId, posts.id),
                  )} LIMIT 1)`,
                }
              : {}),
          })
          .from(posts)
          .limit(20)
          .offset(cursor * 20)
          .orderBy(desc(posts.score))
          .execute()) as (Post & { vote?: number | null })[];
        if (input.onlyMine) {
          const user = await currentUser();
          if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
          return {
            cursor,
            posts: data.map((post) => ({
              ...post,
              vote: post.vote === null ? null : Boolean(post.vote),
              user: {
                imageUrl: user.imageUrl,
                username: user.username,
              },
            })),
          };
        }
        return {
          cursor,
          posts: await Promise.all(
            data.map(async (post) => {
              const user = await clerkClient.users.getUser(post.userId);
              return {
                ...post,
                vote: post.vote === null ? null : Boolean(post.vote),
                user: {
                  imageUrl: user.imageUrl,
                  username: user.username,
                },
              };
            }),
          ),
        };
      },
    ),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3).max(256),
        text: z.string().min(8).max(1024),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        userId: ctx.auth.userId,
        text: input.text,
        title: input.title,
      });
      revalidatePath("/", "page");
    }),
  setVote: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid2(),
        vote: z.boolean().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentVote = await ctx.db.query.postVotes.findFirst({
        where: and(
          eq(postVotes.postId, input.postId),
          eq(postVotes.userId, ctx.auth.userId),
        ),
        columns: {
          isUpvote: true,
        },
      });
      if (currentVote) {
        await ctx.db.transaction(async (tx) => {
          await tx
            .delete(postVotes)
            .where(
              and(
                eq(postVotes.postId, input.postId),
                eq(postVotes.userId, ctx.auth.userId),
              ),
            );
          await tx
            .update(posts)
            .set({
              score: sql`score + ${currentVote.isUpvote ? -1 : 1}`,
            })
            .where(eq(posts.id, input.postId));
        });
      }
      if (input.vote !== null) {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(postVotes).values({
            isUpvote: input.vote!,
            postId: input.postId,
            userId: ctx.auth.userId,
          });
          await tx
            .update(posts)
            .set({
              score: sql`score + ${input.vote ? 1 : -1}`,
            })
            .where(eq(posts.id, input.postId));
        });
      }
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
        columns: {
          score: true,
        },
      });
      return post?.score ?? 0;
    }),
  getById: publicProcedure
    .input(z.string().cuid2())
    .query(async ({ ctx, input }) => {
      const [post] = (await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          text: posts.text,
          userId: posts.userId,
          createdAt: posts.createdAt,
          score: posts.score,
          ...(ctx.auth.userId
            ? {
                vote: sql`(SELECT ${
                  postVotes.isUpvote
                } FROM ${postVotes} WHERE ${and(
                  eq(postVotes.userId, ctx.auth.userId),
                  eq(postVotes.postId, posts.id),
                )} LIMIT 1)`,
              }
            : {}),
        })
        .from(posts)
        .where(eq(posts.id, input))
        .limit(1)
        .execute()) as (Post & { vote?: number | null })[];
      if (!post) return null;
      const user = await clerkClient.users.getUser(post.userId);
      return {
        ...post,
        vote: post.vote === null ? null : Boolean(post.vote),
        user: {
          imageUrl: user.imageUrl,
          username: user.username,
        },
      };
    }),
});
