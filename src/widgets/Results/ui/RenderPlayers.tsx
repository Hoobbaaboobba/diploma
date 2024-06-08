"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import WaitingPlayer from "./WaitingPlayer";
import { Loader2 } from "lucide-react";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";

interface RenderPlayersProps {
  roomId: string;
  isEveryBodyAnswerd: boolean;
}

export default function RenderPlayers({
  roomId,
  isEveryBodyAnswerd,
}: RenderPlayersProps) {
  const getPlayers = useQuery(api.players.get, {
    roomId: roomId as Id<"Rooms">,
  });

  if (!getPlayers) {
    return <LoaderAnimation />;
  }

  return (
    <div className="container flex flex-col gap-2 justify-center items-center mt-10">
      {getPlayers.map((player) => (
        <WaitingPlayer
          key={player._id}
          playerName={player.name}
          isPlayerAnswered={player.isAnswered}
        />
      ))}
      <Loader2 className="animate-spin mt-4" />
      {!isEveryBodyAnswerd ? (
        <span className="text-black/50 text-sm">Waiting for everybody...</span>
      ) : (
        <span className="text-black/50 text-sm">
          Everybody has answered! Waiting for Organizer...
        </span>
      )}
    </div>
  );
}
