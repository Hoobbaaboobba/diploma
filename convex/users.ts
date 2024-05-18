import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("Users", {
      userId: args.userId,
      name: args.name,
    });
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    return ctx.db.query("Users").collect();
  },
});
