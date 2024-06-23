import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create group", async () => {
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

  // тестируем создание группы
  await t.mutation(api.groups.create, {
    groupId: "someGroupId",
    questionId: questionId,
  });
});

test("get all groups by question id", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // тестируем получение всех групп
  await t.query(api.groups.getAllGroups, {});
});

test("get group by question id", async () => {
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

  // тестируем получение группы с помощью question id
  await t.query(api.groups.getGroupsByQuestionId, {
    questionId: questionId,
  });
});

test("update group", async () => {
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

  // тестируем обновление группы
  await t.mutation(api.groups.update, {
    groupId: "someGroupId",
    _id: groupId,
  });
});

test("update group likes", async () => {
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

  // тестируем обновление лайков группы
  await t.mutation(api.groups.updateLikes, {
    likes: true,
    groupId: groupId,
  });
});
