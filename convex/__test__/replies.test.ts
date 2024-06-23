import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create reply", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  const groupId = await t.mutation(api.groups.create, {
    groupId: "someGroupId",
    questionId: questionId,
  });
  await t.mutation(api.replies.create, {
    userId: "someUserId",
    content: "someContent",
    groupId: groupId,
    userName: "someUserName",
  });
});

test("delete reply", async () => {
  const t = convexTest(schema);
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  const groupId = await t.mutation(api.groups.create, {
    groupId: "someGroupId",
    questionId: questionId,
  });
  const replyId = await t.mutation(api.replies.create, {
    userId: "someUserId",
    content: "someContent",
    groupId: groupId,
    userName: "someUserName",
  });

  await t.mutation(api.replies.deleteReply, {
    replyId: replyId,
  });
});

test("get reply by group id", async () => {
  const t = convexTest(schema);

  await t.query(api.replies.getByGroupId, {});
});
