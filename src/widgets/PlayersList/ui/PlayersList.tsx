"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useState } from "react";

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

  return (
    <div className="w-full container h-screen flex flex-col gap-16 items-center mt-10">
      <div className="flex justify-center container items-center gap-2">
        {getPlayers?.map((player) => (
          <div
            key={player._id}
            className="w-full h-10 relative border flex justify-start items-center text-xl rounded-md px-4"
          >
            {player.name}
            {player.isReady && (
              <div className="rounded-full bg-emerald-400 border absolute p-1 -bottom-2 -right-2">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
      {getCurrentUser?.map((e) => e.isReady).toString() === "true" ? (
        <Button onClick={onUnReady} className="w-[100px]">
          UnReady
        </Button>
      ) : (
        <Button onClick={onReady} className="w-[100px]">
          Ready
        </Button>
      )}
    </div>
  );
}
