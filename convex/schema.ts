import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Схемы таблиц
export default defineSchema({
  // Схема таблицы комнат в базе данных
  Rooms: defineTable({
    createId: v.string(), // id создания комнаты
    authorID: v.string(), // id того, кто создал комнату
    // isCreated: v.boolean(),
    isVoteStarted: v.boolean(),
    isVoteEnd: v.boolean(),
    isStart: v.boolean(), // началась ли конференция
    icebreakerQuestionContent: v.string(), // конент Iceberg вопроса
    time: v.number(),
  }).index("by_create", ["createId"]), // поиск таблицы по id создания

  // Схема таблицы пользователей в базе данных
  Users: defineTable({
    userId: v.string(), // id пользователя
    name: v.string(), // имя пользователя
  }),

  // Схема игроков (так как каждый пользователь может участвовать в нескольких коматах)
  Players: defineTable({
    playerId: v.string(), // id игрока
    name: v.string(), // имя игрока
    roomId: v.id("Rooms"), // id комнаты, в которой находится игрок
    role: v.string(), // роль игрока
    isReady: v.boolean(), // приготовился ли игрок
    isAnswered: v.boolean(),
    likesAllowed: v.number(),
  })
    .index("by_room", ["roomId"]) // поиск игрока по id комнаты
    .index("by_playerId", ["playerId"]), // поиск игрока по id игрока

  // Схема вопросов
  Questions: defineTable({
    roomId: v.id("Rooms"), // id комнаты, к которой относится вопрос
    content: v.string(), // содержание вопроса
  }).index("by_room", ["roomId"]), // поиск вопроса по id комнаты

  // Схема ответов на вопросы
  Answers: defineTable({
    userId: v.string(), // id пользователя, который ответил на вопрос
    playerName: v.string(),
    questionId: v.id("Questions"), // id вопроса, на который был дан ответ
    content: v.string(), // содержание ответа
    roomId: v.id("Rooms"),
    groupId: v.string(),
  })
    //.index("by_user", ["userId"]) // поиск ответа по id пользователя
    .index("by_question", ["questionId"]) // поиск ответа по id вопроса
    .index("by_room", ["roomId"]),

  Groups: defineTable({
    groupId: v.string(),
    questionId: v.id("Questions"),
    likes: v.number(),
  }).index("by_questionId", ["questionId"]),

  LikedPeople: defineTable({
    userId: v.string(),
    groupId: v.id("Groups"),
    isLiked: v.boolean(),
  }).index("by_userId", ["userId"]),

  Replies: defineTable({
    userName: v.string(),
    userId: v.string(),
    content: v.string(),
    groupId: v.id("Groups"),
  }).index("by_groupId", ["groupId"]),

  IcebreakerQuestionTemplates: defineTable({
    content: v.string(),
  }),

  QuestionTemplates: defineTable({
    content: v.string(),
  }),
});
