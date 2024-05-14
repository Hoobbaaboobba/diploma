import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTodo = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      text: args.text,
    });
  },
});

export const getTodos = query({
  handler: async (ctx) => {
    return ctx.db.query("todos").collect();
  },
});
