import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const mysqlTable = mysqlTableCreator((name) => `luminosity_${name}`);

export const posts = mysqlTable(
  "post",
  {
    id: varchar("id", { length: 24 })
      .primaryKey()
      .$defaultFn(() => createId()),
    title: varchar("title", { length: 256 }),
    text: varchar("text", { length: 1024 }),
    userId: varchar("user_id", { length: 32 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    score: int("score").notNull().default(0),
  },
  (post) => ({
    score: index("post_score").on(post.score),
  }),
);

export type Post = typeof posts.$inferSelect;

export const postsRelations = relations(posts, ({ many }) => ({
  votes: many(postVotes),
  comments: many(comments),
}));

export const postVotes = mysqlTable(
  "post_vote",
  {
    postId: varchar("post_id", { length: 24 }).notNull(),
    userId: varchar("user_id", { length: 32 }).notNull(),
    isUpvote: boolean("is_upvote").notNull(),
  },
  (vote) => ({
    pk: primaryKey(vote.postId, vote.userId),
  }),
);

export const postVotesRelations = relations(postVotes, ({ one }) => ({
  post: one(posts, {
    fields: [postVotes.postId],
    references: [posts.id],
  }),
}));

export const comments = mysqlTable(
  "comment",
  {
    id: varchar("id", { length: 24 })
      .primaryKey()
      .$defaultFn(() => createId()),
    postId: varchar("post_id", { length: 24 }).notNull(),
    text: varchar("text", { length: 1024 }),
    userId: varchar("user_id", { length: 32 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    parentId: varchar("parent_id", { length: 24 }),
    score: int("score").notNull().default(0),
  },
  (comment) => ({
    score: index("comment_score").on(comment.score),
  }),
);

export const commentsRelations = relations(comments, ({ many, one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    relationName: "parent",
    fields: [comments.parentId],
    references: [comments.id],
  }),
  children: many(comments, {
    relationName: "parent",
  }),
  votes: many(commentVotes),
}));

export const commentVotes = mysqlTable(
  "comment_vote",
  {
    commentId: varchar("comment_id", { length: 24 }).notNull(),
    userId: varchar("user_id", { length: 32 }).notNull(),
    isUpvote: boolean("is_upvote").notNull(),
  },
  (vote) => ({
    pk: primaryKey(vote.commentId, vote.userId),
  }),
);

export const commentVotesRelations = relations(commentVotes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentVotes.commentId],
    references: [comments.id],
  }),
}));
