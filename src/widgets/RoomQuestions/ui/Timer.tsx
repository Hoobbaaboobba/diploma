"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/ui/skeleton";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function Timer({ params, session }: RoomQuestionsProps) {
  const [isTimerEnd, setIsTimerEnd] = useState(false);

  const { mutate, pending } = useApiMutation(api.rooms.updateTimer);
  const getRoom = useQuery(api.rooms.getRoomById, {
    roomId: params.roomId as Id<"Rooms">,
  });

  const { mutate: updateIsAnswered, pending: updateIsAnsweredPendinf } =
    useApiMutation(api.players.updateAnswered);

  const getCurrentUser = useQuery(api.players.getCurrent, {
    roomId: params.roomId as Id<"Rooms">,
    playerId: session.user.id,
  });

  const router = useRouter();

  useEffect(() => {
    if ((getRoom?.time as number) > 0) {
      let interval = null;
      interval = setInterval(() => {
        mutate({
          roomId: params.roomId as Id<"Rooms">,
          time: (getRoom?.time as number) - 1,
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if ((getRoom?.time as number) === 0) {
      updateIsAnswered({
        playerId: getCurrentUser?.map((e) => e._id).toString() as Id<"Players">,
        isAnswered: true,
      }).then(() => router.push(`/results/${params.roomId}`));
    }
  }, [
    getCurrentUser,
    getRoom?.time,
    mutate,
    params.roomId,
    router,
    updateIsAnswered,
  ]);

  if (!getRoom?.time) {
    return (
      <Skeleton className="w-11 h-11 absolute top-5 left-5 rounded-full" />
    );
  }

  return (
    <div
      className={`${(getRoom?.time as number) > 20 ? "text-emerald-400" : "text-rose-400 timer"} flex absolute left-5 top-5 justify-center items-center text-xl font-bold`}
    >
      {isTimerEnd ? "Timer end" : `${getRoom?.time}s`}
    </div>
  );
}
