import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create room", async () => {
  const t = convexTest(schema);

  await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
});

test("get room by create id", async () => {
  const t = convexTest(schema);

  const getRoomByCreateId = await t.query(api.rooms.getRoomByCreateId, {
    createId: "someId",
  });
  expect(getRoomByCreateId).toMatchObject([]);
});

test("get room by id", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  await t.query(api.rooms.getRoomById, {
    roomId: createRoom,
  });
});

test("create icebreaker question", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });
  await t.mutation(api.rooms.createIcebreakerQuestion, {
    icebreakerQuestionContent: "someContent",
    roomId: createRoom,
  });
});

test("end metting", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.rooms.endMeeting, {
    roomId: createRoom,
  });
});

test("end vote", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.rooms.endVote, {
    isVoteEnd: true,
    roomId: createRoom,
  });
});

test("update start", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.rooms.updateStart, {
    isStart: true,
    roomId: createRoom,
  });
});

test("update timer", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.rooms.updateTimer, {
    time: 123456,
    roomId: createRoom,
  });
});

test("update vote", async () => {
  const t = convexTest(schema);

  const createRoom = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  await t.mutation(api.rooms.updateVote, {
    isVoteStarted: true,
    roomId: createRoom,
  });
});
