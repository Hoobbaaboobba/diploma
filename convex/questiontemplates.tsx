import { v } from "convex/values";
import { query } from "./_generated/server";

export const getIcebreaker = query({
  args: {},
  handler: async (ctx, _) => {
    const icebreakerTemplates = ctx.db
      .query("IcebreakerQuestionTemplates")
      .collect();

    return icebreakerTemplates;
  },
});

export const getQuestions = query({
  args: {},
  handler: async (ctx, _) => {
    const questions = ctx.db.query("QuestionTemplates").collect();

    return questions;
  },
});
