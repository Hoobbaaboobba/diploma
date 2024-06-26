import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// функция создания игрока
export const create = mutation({
  args: {
    playerId: v.string(), // id игрока
    name: v.string(), // имя игрока
    roomId: v.id("Rooms"), // id комнаты, в которой находится игрок
    role: v.string(), // роль игрока
    isReady: v.boolean(), // приготовился ли игрок
    isAnswered: v.boolean(),
  },
  handler: async (ctx, args) => {
    // прокидываем эти аргументы
    return await ctx.db.insert("Players", {
      playerId: args.playerId,
      name: args.name,
      roomId: args.roomId,
      role: args.role,
      isReady: args.isReady,
      isAnswered: args.isAnswered,
      likesAllowed: 3,
    });
  },
});

// функция получения комнат
export const get = query({
  args: {
    roomId: v.id("Rooms"), // id комнаты, которую хотим получить
  },
  handler: async (ctx, args) => {
    const players = ctx.db
      .query("Players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    return players;
  },
});

export const getCurrent = query({
  args: {
    roomId: v.id("Rooms"),
    playerId: v.string(),
  },
  handler: async (ctx, args) => {
    const players = ctx.db
      .query("Players")
      .withIndex("by_playerId", (q) => q.eq("playerId", args.playerId))
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .collect();

    return players;
  },
});

export const updateReady = mutation({
  args: {
    playerId: v.id("Players"),
    isReady: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      isReady: args.isReady,
    });
  },
});

export const updateAnswered = mutation({
  args: {
    playerId: v.id("Players"),
    isAnswered: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      isAnswered: args.isAnswered,
    });
  },
});

export const updateLikes = mutation({
  args: {
    playerId: v.id("Players"),
    likes: v.boolean(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db.get(args.playerId);
    if (args.likes) {
      return await ctx.db.patch(args.playerId, {
        likesAllowed: (likes?.likesAllowed as number) + 1,
      });
    }
    return await ctx.db.patch(args.playerId, {
      likesAllowed: (likes?.likesAllowed as number) - 1,
    });
  },
});

export const deletePlayer = mutation({
  args: {
    playerId: v.id("Players"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.playerId);
  },
});
