import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const likes = ctx.db.query("LikedPeople").collect();

    return likes;
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    groupId: v.id("Groups"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("LikedPeople", {
      userId: args.userId,
      groupId: args.groupId,
      isLiked: true,
    });
  },
});

export const update = mutation({
  args: {
    likedPeopleId: v.id("LikedPeople"),
    isLiked: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.likedPeopleId, {
      isLiked: args.isLiked,
    });
  },
});
