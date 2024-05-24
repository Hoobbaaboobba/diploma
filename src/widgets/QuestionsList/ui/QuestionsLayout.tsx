"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Button } from "@/shared/ui/button";
import { QuestionsList } from "@/widgets/QuestionsList";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import IcebergQuestion from "./IcebergQuestion";
import { Separator } from "@/shared/ui/separator";
import SetTime from "./SetTime";

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
  const getRoom = useQuery(api.rooms.getRoomByCreateId, {
    createId: params.createId,
  });

  /* 
    getRoom возвращает на массив объектов, 
    но, так как в массиве только один объект,
    мы с помощью метода map вытаскиваем id объекта
    и преобразуем в строку
  */
  const roomId = getRoom?.map((e) => e._id).toString() as string;

  const getQuestions = useQuery(api.questions.get, {
    roomId: roomId as Id<"Rooms">,
  });

  /* 
    Этот хук создает игрока
    Мы также вытаскиваем функцию и состояние загрузки
  */
  const { mutate: createPlayer, pending: pendingCreatePlayer } = useApiMutation(
    api.players.create
  );

  // const { mutate: updateCreate, pending: pendingCreate } = useApiMutation(
  //   api.rooms.updateCreate
  // );

  // Пока страница создания комнаты загружается, рисуем красивый UI
  if (!getRoom) {
    return (
      <div className="container mt-10">
        <Skeleton className="w-full h-[202px]" />
      </div>
    );
  }

  function getIn() {
    router.push(`/waitingrooms/${roomId}`);
  }

  if (getRoom[0].isStart) {
    return (
      <div className="container mt-40 flex flex-col justify-center items-center">
        <p className="text-2xl font-bold">Conference is ongoing</p>
        <Button onClick={getIn} className="mt-2">
          Get in
        </Button>
      </div>
    );
  }

  // Создаем функцию, которая вызывается при нажатии кнопки "Start"
  function onStart() {
    // updateCreate({
    //   roomId: roomId as Id<"Rooms">,
    //   isCreated: true
    // })
    //Вызываем функцию создания игрока, которую вытащили из useApiMutation выше
    createPlayer({
      name: session.user.name, // Из сессии в cookie берем имя пользователя
      playerId: session.user.id, // Из сессии в cookie берем id пользователя
      roomId: roomId, // Из переменной выше берем id комнаты
      role: "Admin", // Тот, кто создал комнату, получает роль админа
      isReady: false, // По умолчанию игрок не готов
      isAnswered: false,
    }).then(() => router.push(`/waitingrooms/${roomId}`)); // После чего перкидываем пользователя в саму комнату
  }

  // Если страница создания комнаты загружена, рисуем вопросы
  return (
    <div className="flex container flex-col items-end justify-center py-8">
      <IcebergQuestion
        roomId={roomId}
        icebergQuestionContent={getRoom
          .map((e) => e.icebergQuestionContent)
          .toString()}
      />
      <SetTime createId={params.createId} />
      <Separator className="w-full h-[2px] my-10" />
      <QuestionsList roomId={roomId} />
      <Button
        className="mt-6"
        disabled={getQuestions?.length === 0 || pendingCreatePlayer}
        onClick={onStart}
      >
        Room
        {pendingCreatePlayer ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <ChevronRight strokeWidth={1.5} className="ml-2 w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
