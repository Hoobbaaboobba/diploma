import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("get answers", async () => {
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

  // тестируем получение ответа
  await t.query(api.answers.get, {
    questionId: questionId,
  });
});

test("get answers by room", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // тестируем получение ответа, используя room id
  await t.query(api.answers.getByRoom, {
    roomId: roomId,
  });
});

test("create answer", async () => {
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

  // тестируем создание ответа
  await t.mutation(api.answers.create, {
    userId: "someUserId",
    playerName: "somePlayerName",
    questionId: questionId,
    content: "someContent",
    roomId: roomId,
    groupId: "someGroupId",
  });
});

test("delete answer", async () => {
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

  // получаем answer id, созавая тестовый ответ
  const answerId = await t.mutation(api.answers.create, {
    userId: "someUserId",
    playerName: "somePlayerName",
    questionId: questionId,
    content: "someContent",
    roomId: roomId,
    groupId: "someGroupId",
  });

  // тестируем удаление ответа
  await t.mutation(api.answers.deleteAnswer, {
    answerId: answerId,
  });
});

test("update answer", async () => {
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

  // получаем answer id, созавая тестовый ответ
  const answerId = await t.mutation(api.answers.create, {
    userId: "someUserId",
    playerName: "somePlayerName",
    questionId: questionId,
    content: "someContent",
    roomId: roomId,
    groupId: "someGroupId",
  });

  // тестируем обновление ответа
  await t.mutation(api.answers.update, {
    content: "someContent",
    answerId: answerId,
  });
});

test("update group id", async () => {
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

  // получаем answer id, созавая тестовый ответ
  const answerId = await t.mutation(api.answers.create, {
    userId: "someUserId",
    playerName: "somePlayerName",
    questionId: questionId,
    content: "someContent",
    roomId: roomId,
    groupId: "someGroupId",
  });

  // тестируем обновление group id ответа
  await t.mutation(api.answers.updateGroupId, {
    groupId: "someGroupId",
    answerId: answerId,
  });
});
