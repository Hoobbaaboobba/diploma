import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.string(),
    questionId: v.id("Questions"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("Answers", {
      userId: args.userId,
      questionId: args.questionId,
      content: args.content,
    });
  },
});

export const get = query({
  args: {
    questionId: v.id("Questions"),
  },
  handler: async (ctx, args) => {
    const answers = ctx.db
      .query("Answers")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .collect();

    return answers;
  },
});
