import { convexTest } from "convex-test";
import { test } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

test("create player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // тестируем создание игрока
  await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });
});

test("delete player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем player id, созавая тестового игрока
  const playerId = await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });

  // тестируем удаления игрока
  await t.mutation(api.players.deletePlayer, {
    playerId: playerId,
  });
});

test("get player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // тестируем получение игрока
  await t.query(api.players.get, {
    roomId: roomId,
  });
});

test("get current player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем player id, созавая тестового игрока
  const playerId = await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });

  // тестируем получение текущего игрока
  await t.query(api.players.getCurrent, {
    roomId: roomId,
    playerId: playerId,
  });
});

test("update answered player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем player id, созавая тестового игрока
  const playerId = await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });

  // тестируем обновление игрока, если тот ответил
  await t.mutation(api.players.updateAnswered, {
    isAnswered: true,
    playerId: playerId,
  });
});

test("update likes", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем player id, созавая тестового игрока
  const playerId = await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });

  // тестируем обновление лайков игрока
  await t.mutation(api.players.updateLikes, {
    likes: true,
    playerId: playerId,
  });
});

test("update ready player", async () => {
  // идентифицируем сами тесты
  const t = convexTest(schema);

  // получаем room id, созавая тестовую комнату
  const roomId = await t.mutation(api.rooms.createRoom, {
    authorID: "someAuthorId",
    createId: "someCreateId",
  });

  // получаем player id, созавая тестового игрока
  const playerId = await t.mutation(api.players.create, {
    name: "someName",
    playerId: "someId",
    roomId: roomId,
    role: "someRole",
    isReady: true,
    isAnswered: true,
  });

  // тестируем обновление игрока, если тот готов
  await t.mutation(api.players.updateReady, {
    isReady: true,
    playerId: playerId,
  });
});
