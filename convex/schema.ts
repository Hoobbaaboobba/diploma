import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Схемы таблиц
export default defineSchema({
  // Схема таблицы комнат в базе данных
  Rooms: defineTable({
    createId: v.string(), // id создания комнаты
    authorID: v.string(), // id того, кто создал комнату
    isVoteStarted: v.boolean(), // началось ли голосование
    isVoteEnd: v.boolean(), // закончилось ли голосование
    isStart: v.boolean(), // началась ли конференция
    isMeetingEnd: v.boolean(),
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
    playerName: v.string(), // имя пользователя, который ответил на вопрос
    questionId: v.id("Questions"), // id вопроса, на который был дан ответ
    content: v.string(), // содержание ответа
    roomId: v.id("Rooms"), // id комнаты, к которой относится ответ
    groupId: v.string(), // id группы, к которой относится ответ
  })
    //.index("by_user", ["userId"]) // поиск ответа по id пользователя
    .index("by_question", ["questionId"]) // поиск ответа по id вопроса
    .index("by_room", ["roomId"]), // поиск ответа по id комнаты

  // Схема группы ответов
  Groups: defineTable({
    groupId: v.string(), // вспомогательное id группы
    questionId: v.id("Questions"), // id вопроса, к которой относится ответ
    likes: v.number(), // количество лайков группы ответов
  }).index("by_questionId", ["questionId"]), // поиск группы по id вопроса

  // Схема лайка
  LikedPeople: defineTable({
    userId: v.string(), // id пользователя, который поставил лайк
    groupId: v.id("Groups"), // id группы ответов, которой рользователь поставил лайк
    isLiked: v.boolean(), // поставил ли пользователь лайк
  }).index("by_userId", ["userId"]), // найти лайк по id пользователя

  // Схема коментарии
  Replies: defineTable({
    userName: v.string(), // имя пользователя, оставившего комментарий
    userId: v.string(), // id пользователя, оставившего комментарий
    content: v.string(), // содержание комментария
    groupId: v.id("Groups"), // id группы, к которой относится комментарий
  }).index("by_groupId", ["groupId"]), // поиск комментариев по id группы ответов

  // Схема шаблона icebreaker
  IcebreakerQuestionTemplates: defineTable({
    content: v.string(),
  }),

  // Схема шаблонов вопроса
  QuestionTemplates: defineTable({
    content: v.string(),
  }),
});
