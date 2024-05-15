import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  Rooms: defineTable({
    createId: v.string(),
    icebergQuestionContent: v.string(),
  }),
  Users: defineTable({
    userId: v.string(),
    name: v.string(),
    role: v.string(),
    roomId: v.string(),
    isReady: v.boolean(),
  }),
  Questions: defineTable({
    roomId: v.id("Rooms"),
    content: v.string(),
  }),
  Answers: defineTable({
    userId: v.id("Users"),
    questionId: v.id("Questions"),
    content: v.string(),
  }),
});
