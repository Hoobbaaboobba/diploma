import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create user", async () => {
  const t = convexTest(schema);

  await t.mutation(api.users.createUser, {
    userId: "someUserId",
    name: "someName",
  });
});

test("get users", async () => {
  const t = convexTest(schema);

  await t.query(api.users.getUsers, {});
});
