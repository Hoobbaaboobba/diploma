import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("get icebreaker question templates", async () => {
  const t = convexTest(schema);

  await t.query(api.questiontemplates.getIcebreaker, {});
});

test("get questions templates", async () => {
  const t = convexTest(schema);

  await t.query(api.questiontemplates.getQuestions, {});
});
