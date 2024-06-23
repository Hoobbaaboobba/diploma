import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// функция создания игрока
export const create = mutation({
  args: {
    userName: v.string(),
    userId: v.string(),
    content: v.string(),
    groupId: v.id("Groups"),
  },
  handler: async (ctx, args) => {
    // прокидываем эти аргументы
    return await ctx.db.insert("Replies", {
      userName: args.userName,
      userId: args.userId,
      content: args.content,
      groupId: args.groupId,
    });
  },
});

export const getByGroupId = query({
  args: {},
  handler: async (ctx, _) => {
    const replies = ctx.db.query("Replies").collect();

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
