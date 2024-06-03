import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const getByUserId = query({
//   args: {
//     answerId: v.id("Answers"),
//   },
//   handler: async (ctx, args) => {
//     const user = ctx.db
//       .query("LikedPeople")
//       .withIndex("by_answerId", (q) => q.eq("answerId", args.answerId))
//       .collect();

//     return user;
//   },
// });

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
    await ctx.db.insert("LikedPeople", {
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
