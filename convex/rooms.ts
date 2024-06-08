import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createRoom = mutation({
  args: {
    authorID: v.string(),
    createId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("Rooms", {
      authorID: args.authorID,
      isStart: false,
      createId: args.createId,
      time: 0,
      icebreakerQuestionContent: "",
      isVoteStarted: false,
    });
  },
});

export const getRoomByCreateId = query({
  args: {
    createId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = ctx.db
      .query("Rooms")
      .withIndex("by_create", (q) => q.eq("createId", args.createId))
      .collect();

    return room;
  },
});

export const getRoomById = query({
  args: {
    roomId: v.id("Rooms"),
  },
  handler: async (ctx, args) => {
    const room = ctx.db.get(args.roomId);

    return room;
  },
});

export const updateVote = mutation({
  args: {
    roomId: v.id("Rooms"),
    isVoteStarted: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      isVoteStarted: args.isVoteStarted,
    });
  },
});

export const updateStart = mutation({
  args: {
    roomId: v.id("Rooms"),
    isStart: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      isStart: args.isStart,
    });
  },
});

export const updateTimer = mutation({
  args: {
    roomId: v.id("Rooms"),
    time: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      time: args.time,
    });
  },
});

export const createIcebreakerQuestion = mutation({
  args: {
    roomId: v.id("Rooms"),
    icebreakerQuestionContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      icebreakerQuestionContent: args.icebreakerQuestionContent,
    });
  },
});
