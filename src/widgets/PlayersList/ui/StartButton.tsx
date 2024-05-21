"use client";

import { Button } from "@/shared/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";

interface StartButtonProps {
  params: {
    roomId: string;
  };
  userId: string;
  role: string;
  getPlayers:
    | {
        _id: Id<"Players">;
        _creationTime: number;
        name: string;
        playerId: string;
        roomId: Id<"Rooms">;
        role: string;
        isReady: boolean;
      }[]
    | undefined;
}

export default function StartButton({
  params,
  getPlayers,
  userId,
  role,
}: StartButtonProps) {
  const isEverybodyReady =
    getPlayers?.length === getPlayers?.filter((e) => e.isReady === true).length;

  const { mutate: createAnswers } = useApiMutation(api.answers.create);

  /* 
  Этот хук начинает игру, делает isStart === true в бд
  Мы также вытаскиваем функцию и состояние загрузки
  */
  const { mutate, pending: pending } = useApiMutation(api.rooms.updateStart);

  function onClick() {
    //Вызываем функцию начала игры, которую вытащили из useApiMutation выше
    mutate({
      roomId: params.roomId, // Из переменной выше берем id комнаты
      isStart: true, // Создание комнаты завершено, ставим true
    });
  }
  return (
    role === "Admin" && (
      <Button onClick={onClick} disabled={!isEverybodyReady}>
        {pending ? <Loader2 className="animate-spin" /> : "Start"}
      </Button>
    )
  );
}
