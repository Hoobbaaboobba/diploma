"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
}

export default function Timer({ params }: RoomQuestionsProps) {
  const [isTimerEnd, setIsTimerEnd] = useState(false);

  const { mutate, pending } = useApiMutation(api.rooms.updateTimer);
  const getRoom = useQuery(api.rooms.getRoomById, {
    roomId: params.roomId as Id<"Rooms">,
  });

  useEffect(() => {
    if ((getRoom?.countDown as number) > 0) {
      let interval = null;
      interval = setInterval(() => {
        mutate({
          roomId: params.roomId as Id<"Rooms">,
          countDown: (getRoom?.countDown as number) - 1,
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if ((getRoom?.countDown as number) === 0) {
      return setIsTimerEnd(true);
    }
  }, [getRoom?.countDown, mutate, params.roomId]);

  return (
    <div
      className={`${(getRoom?.countDown as number) > 20 ? "text-emerald-400" : "text-rose-400 timer"} flex absolute left-5 top-5 justify-center items-center text-xl font-bold`}
    >
      {isTimerEnd ? "Timer end" : getRoom?.countDown}
    </div>
  );
}
