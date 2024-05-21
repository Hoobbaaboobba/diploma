"use client";

import { useQuery } from "convex/react";
import { Check, Clock, Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ResultsList from "@/widgets/Results/ui/ResultsList";

interface ResultsLayoutProps {
  roomId: string;
  session: any;
}

export default function ResultsLayout({ roomId, session }: ResultsLayoutProps) {
  const getPlayers = useQuery(api.players.get, {
    roomId: roomId as Id<"Rooms">,
  });

  const isEveryBodyAnswerd =
    getPlayers?.length ===
    getPlayers?.filter((e) => e.isAnswered === true).length;

  if (!getPlayers) {
    return <Loader2 className="animate-spin" />;
  }

  if (!isEveryBodyAnswerd) {
    return (
      <div className="container flex flex-col gap-2 justify-center items-center mt-10">
        {getPlayers?.map((player) => (
          <div
            key={player._id}
            className="flex flex-col justify-center container items-center gap-2"
          >
            <div
              key={player._id}
              className="w-full h-10 relative border flex justify-start items-center text-xl rounded-md px-4"
            >
              {player.name}
              <div
                className={`transition rounded-full ${player.isAnswered ? "bg-emerald-400" : "bg-rose-400"} border absolute p-1 -bottom-2 -right-2`}
              >
                {player.isAnswered ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <Clock className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
        <Loader2 className="animate-spin mt-4" />
        <span className="text-black/50 text-sm">Waiting for everybody...</span>
      </div>
    );
  }

  return (
    <div className="container mt-10 space-y-8">
      <ResultsList
        roomId={roomId}
        userId={session.user.id}
        userName={session.user.name}
      />
    </div>
  );
}
