import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create question", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.questions.create, {
    roomId: roomId,
  });
});

test("delete question", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  await t.mutation(api.questions.deleteQ, {
    questionId: questionId,
  });
});

test("create question", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.query(api.questions.get, {
    roomId: roomId,
  });
});

test("update question", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  await t.mutation(api.questions.update, {
    content: "someContent",
    questionId: questionId,
  });
});
