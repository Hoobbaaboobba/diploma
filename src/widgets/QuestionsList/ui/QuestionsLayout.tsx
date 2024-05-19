"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { QuestionsList } from "@/widgets/QuestionsList";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import IcebergQuestion from "./IcebergQuestion";
import { Separator } from "@/shared/ui/separator";

interface QuestionsLayout {
  params: {
    createId: string;
  };
  session: any;
}

export default function QuestionsLayout({ params, session }: QuestionsLayout) {
  // Встроенный хук в next js, который позволяет перемещаться по ссылкам
  const router = useRouter();

  /*
    Хук convex (useQuery), который обращается к бд и создает объект
    С помощью api мы обращаемся к комнатам rooms (rooms.ts)
    Через rooms мы обращаемся к методу getRoom
    Он принимает id создания из url /create/****.
  */
  const getRoom = useQuery(api.rooms.getRoom, {
    createId: params.createId,
  });

  /* 
    Этот хук начинает игру, делает isStart === true в бд
    Мы также вытаскиваем функцию и состояние загрузки
  */
  const { mutate: updateStart, pending: pendingStart } = useApiMutation(
    api.rooms.updateStart
  );

  /* 
    Этот хук создает игрока
    Мы также вытаскиваем функцию и состояние загрузки
  */
  const { mutate: createPlayer, pending: pendingCreatePlayer } = useApiMutation(
    api.players.create
  );

  // Пока страница создания комнаты загружается, рисуем красивый UI
  if (!getRoom) {
    return (
      <div className="container mt-10">
        <Skeleton className="w-full h-[202px]" />
      </div>
    );
  }

  /* 
    getRoom возвращает на массив объектов, 
    но, так как в массиве только один объект,
    мы с помощью метода map вытаскиваем id объекта
    и преобразуем в строку
  */
  const roomId = getRoom.map((e) => e._id).toString();

  // Создаем функцию, которая вызывается при нажатии кнопки "Start"
  function onStart() {
    //Вызываем функцию создания игрока, которую вытащили из useApiMutation выше
    createPlayer({
      name: session.user.name, // Из сессии в cookie берем имя пользователя
      playerId: session.user.id, // Из сессии в cookie берем id пользователя
      roomId: roomId, // Из переменной выше берем id комнаты
      role: "Admin", // Тот, кто создал комнату, получает роль админа
      isReady: false, // По умолчанию игрок не готов
    });

    //Вызываем функцию начала игры, которую вытащили из useApiMutation выше
    updateStart({
      roomId: roomId, // Из переменной выше берем id комнаты
      isStart: true, // Создание комнаты завершено, ставим true
    }).then(() => router.push(`/rooms/${roomId}`)); // После чего перкидываем пользователя в саму комнату
  }

  // Если страница создания комнаты загружена, рисуем вопросы
  return (
    <div className="flex container flex-col items-center justify-center py-8">
      <IcebergQuestion
        roomId={roomId}
        icebergQuestionContent={getRoom
          .map((e) => e.icebergQuestionContent)
          .toString()}
      />
      <Separator className="w-full h-[2px] my-10" />
      <QuestionsList roomId={roomId} />
      <Button
        className="mt-6"
        disabled={pendingStart && pendingCreatePlayer}
        onClick={onStart}
      >
        {pendingStart && pendingCreatePlayer ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Start"
        )}
      </Button>
    </div>
  );
}
