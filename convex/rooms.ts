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
      countDown: 10,
      icebergQuestionContent: "",
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
    countDown: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      countDown: args.countDown,
    });
  },
});

export const createIcebergQuestion = mutation({
  args: {
    roomId: v.id("Rooms"),
    icebergQuestionContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roomId, {
      icebergQuestionContent: args.icebergQuestionContent,
    });
  },
});
