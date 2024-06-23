import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create liked people", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем question id, созавая тестовый вопрос
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  // получаем group _id, созавая тестовую группу
  const groupId = await t.mutation(api.groups.create, {
    groupId: "someGroupId",
    questionId: questionId,
  });

  // тестируем создание лайка
  await t.mutation(api.likedpeople.create, {
    userId: "someUserId",
    groupId: groupId,
  });
});

test("get liked people", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // тестируем получение всех лайков
  await t.query(api.likedpeople.get, {});
});

test("update liked people", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем question id, созавая тестовый вопрос
  const questionId = await t.mutation(api.questions.create, {
    roomId: roomId,
  });

  // получаем group _id, созавая тестовую группу
  const groupId = await t.mutation(api.groups.create, {
    groupId: "someGroupId",
    questionId: questionId,
  });

  // получаем liked people _id, созавая тестовый лайк
  const likedPeopleId = await t.mutation(api.likedpeople.create, {
    userId: "someUserId",
    groupId: groupId,
  });

  // тестируем обновление лайка
  await t.mutation(api.likedpeople.update, {
    isLiked: true,
    likedPeopleId: likedPeopleId,
  });
});
