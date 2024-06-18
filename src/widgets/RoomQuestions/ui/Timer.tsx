"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function Timer({ params, session }: RoomQuestionsProps) {
  const { mutate } = useApiMutation(api.rooms.updateTimer);
  const { mutate: updateIsAnswered } = useApiMutation(
    api.players.updateAnswered
  );

  const getRoom = useQuery(api.rooms.getRoomById, {
    roomId: params.roomId as Id<"Rooms">,
  });

  const getCurrentUser = useQuery(api.players.getCurrent, {
    roomId: params.roomId as Id<"Rooms">,
    playerId: session.user.id,
  });

  useEffect(() => {
    if (!getRoom || !getCurrentUser) {
      return;
    }
    if (getRoom.time > 0) {
      let interval = null;
      interval = setInterval(() => {
        mutate({
          roomId: params.roomId as Id<"Rooms">,
          time: getRoom?.time - 1,
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (getRoom?.time === 0) {
      updateIsAnswered({
        playerId: getCurrentUser[0]._id,
        isAnswered: true,
      }).then(() => redirect(`/results/${params.roomId}`));
    }
  }, [
    getCurrentUser,
    getRoom,
    getRoom?.time,
    mutate,
    params.roomId,
    updateIsAnswered,
  ]);

  // if (!getRoom || !getCurrentUser) {
  //   return <LoaderAnimation />;
  // }

  // if (!getRoom.time) {
  //   return (
  //     <Skeleton className="w-11 h-11 absolute top-5 left-5 rounded-full" />
  //   );
  // }

  return (
    <div
      className={`${(getRoom?.time as number) > 20 ? "text-emerald-400" : "text-rose-400 timer"} flex fixed left-5 top-5 justify-center items-center text-xl font-bold`}
    >
      {getRoom?.time}s
    </div>
  );
}
