import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    questionId: v.id("Questions"),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("Groups", {
      questionId: args.questionId,
      groupId: args.groupId,
      likes: 0,
    });
  },
});

export const update = mutation({
  args: {
    _id: v.id("Groups"),
    groupId: v.string(),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.patch(args._id, {
      groupId: args.groupId,
    });
    return group;
  },
});

export const updateLikes = mutation({
  args: {
    groupId: v.id("Groups"),
    likes: v.boolean(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db.get(args.groupId);
    if (args.likes) {
      return await ctx.db.patch(args.groupId, {
        likes: (likes?.likes as number) + 1,
      });
    }
    return await ctx.db.patch(args.groupId, {
      likes: (likes?.likes as number) - 1,
    });
  },
});

export const getGroupsByQuestionId = query({
  args: {
    questionId: v.id("Questions"),
  },
  handler: async (ctx, args) => {
    const groups = ctx.db
      .query("Groups")
      .withIndex("by_questionId", (q) => q.eq("questionId", args.questionId))
      .collect();

    return groups;
  },
});

export const getAllGroups = query({
  args: {},
  handler: async (ctx, _) => {
    const groups = ctx.db.query("Groups").collect();

    return groups;
  },
});
