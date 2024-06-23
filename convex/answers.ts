import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    playerName: v.string(),
    questionId: v.id("Questions"),
    content: v.string(),
    roomId: v.id("Rooms"),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("Answers", {
      userId: args.userId,
      playerName: args.playerName,
      questionId: args.questionId,
      content: args.content,
      roomId: args.roomId,
      groupId: args.groupId,
    });
  },
});

export const get = query({
  args: {
    questionId: v.id("Questions"),
  },
  handler: async (ctx, args) => {
    const answers = ctx.db
      .query("Answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    return answers;
  },
});

export const getByRoom = query({
  args: {
    roomId: v.id("Rooms"),
  },
  handler: async (ctx, args) => {
    const answers = ctx.db
      .query("Answers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    return answers;
  },
});

export const update = mutation({
  args: {
    answerId: v.id("Answers"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.answerId, {
      content: args.content,
    });
  },
});

export const updateGroupId = mutation({
  args: {
    answerId: v.id("Answers"),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.answerId, {
      groupId: args.groupId,
    });
  },
});

export const deleteAnswer = mutation({
  args: {
    answerId: v.id("Answers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.answerId);
  },
});
