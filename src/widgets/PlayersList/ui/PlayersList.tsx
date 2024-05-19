"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useState } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoginFormByLink } from "@/features/LoginFormByLink";

interface PlayersListProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function PlayersList({ params, session }: PlayersListProps) {
  const getPlayers = useQuery(api.players.get, {
    roomId: params.roomId as Id<"Rooms">,
  });

  const getCurrentUser = useQuery(api.players.getCurrent, {
    playerId: session.user.id,
  });

  const { mutate, pending } = useApiMutation(api.players.updateReady);

  const { mutate: createPlayer } = useApiMutation(api.players.create);

  function onReady() {
    return mutate({
      playerId: getCurrentUser?.map((e) => e._id).toString() as Id<"Players">,
      isReady: true,
    });
  }

  function onUnReady() {
    return mutate({
      playerId: getCurrentUser?.map((e) => e._id).toString() as Id<"Players">,
      isReady: false,
    });
  }

  if (!getPlayers) {
    return (
      <div className="container space-y-1 mt-10">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    );
  }

  if (getPlayers.filter((e) => e.playerId === session.user.id).length === 0) {
    createPlayer({
      name: session.user.name,
      playerId: session.user.id,
      roomId: params.roomId,
      role: "quest",
      isReady: false,
    });
  }

  return (
    <div className="w-full container p-0 flex flex-col gap-16 items-center mt-10">
      <div className="flex flex-col justify-center container items-center gap-2">
        {getPlayers?.map((player) => (
          <div
            key={player._id}
            className="w-full h-10 relative border flex justify-start items-center text-xl rounded-md px-4"
          >
            {player.name}
            <div
              className={`${player.isReady ? "scale-100" : "scale-0"} transition rounded-full bg-emerald-400 border absolute p-1 -bottom-2 -right-2`}
            >
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>
        ))}
      </div>
      {getCurrentUser?.map((e) => e.isReady).toString() === "true" ? (
        <Button onClick={onUnReady} className="w-[100px]">
          {pending ? <Loader2 className="animate-spin" /> : "UnReady"}
        </Button>
      ) : (
        <Button onClick={onReady} className="w-[100px]">
          {pending ? <Loader2 className="animate-spin" /> : "Ready"}
        </Button>
      )}
    </div>
  );
}
