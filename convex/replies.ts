import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// функция создания игрока
export const create = mutation({
  args: {
    userName: v.string(),
    userId: v.string(),
    content: v.string(),
    answerId: v.id("Answers"),
  },
  handler: async (ctx, args) => {
    // прокидываем эти аргументы
    await ctx.db.insert("Replies", {
      userName: args.userName,
      userId: args.userId,
      content: args.content,
      answerId: args.answerId,
    });
  },
});

export const getByAnswerId = query({
  args: {
    answerId: v.id("Answers"), // id комнаты, которую хотим получить
  },
  handler: async (ctx, args) => {
    const replies = ctx.db
      .query("Replies")
      .withIndex("by_answerId", (q) => q.eq("answerId", args.answerId))
      .collect();

    return replies;
  },
});

export const deleteReply = mutation({
  args: {
    replyId: v.id("Replies"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.replyId);
  },
});
