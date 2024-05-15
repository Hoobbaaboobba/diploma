import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getSession } from "../lib";

export const createRoom = mutation({
  args: {
    createId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("Rooms", {
      createId: args.createId,
      icebergQuestionContent: "",
    });
  },
});

export const getRoom = query({
  args: {
    roomId: v.id("Rooms"),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("Rooms")
      .filter((q) => q.eq(q.field("_id"), args.roomId))
      .collect();
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
