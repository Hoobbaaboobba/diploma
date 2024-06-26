"use client";

import { Button } from "@/shared/ui/button";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Loader2 } from "lucide-react";

interface StartButtonProps {
  params: {
    roomId: string;
  };
  userId: string;
  role: string;
  getPlayers: Doc<"Players">[] | undefined;
}

export default function StartButton({
  params,
  getPlayers,
  role,
}: StartButtonProps) {
  /* 
  Этот хук начинает игру, делает isStart === true в бд
  Мы также вытаскиваем функцию и состояние загрузки
  */
  const { mutate, pending: pending } = useApiMutation(api.rooms.updateStart);

  if (!getPlayers) {
    return null;
  }
  const isEverybodyReady =
    getPlayers.length === getPlayers.filter((e) => e.isReady === true).length;

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
