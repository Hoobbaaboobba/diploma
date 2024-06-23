import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    roomId: v.id("Rooms"),
  },
  handler: async (ctx, args) => {
    const questions = ctx.db
      .query("Questions")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    return questions;
  },
});

export const create = mutation({
  args: {
    roomId: v.id("Rooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("Questions", {
      roomId: args.roomId,
      content: "",
    });
  },
});

export const update = mutation({
  args: {
    questionId: v.id("Questions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.questionId, {
      content: args.content,
    });
  },
});

export const deleteQ = mutation({
  args: {
    questionId: v.id("Questions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.questionId);
  },
});
