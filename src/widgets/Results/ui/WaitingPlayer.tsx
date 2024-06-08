import { Check, Clock } from "lucide-react";

interface WaitingPlayerProps {
  playerName: string;
  isPlayerAnswered: boolean;
}

export default function WaitingPlayer({
  playerName,
  isPlayerAnswered,
}: WaitingPlayerProps) {
  return (
    <div className="w-full h-10 relative border flex justify-start items-center text-xl rounded-md px-4">
      {playerName}
      <div
        className={`transition rounded-full ${isPlayerAnswered ? "bg-emerald-400" : "bg-rose-400"} border absolute p-1 -bottom-2 -right-2`}
      >
        {isPlayerAnswered ? (
          <Check className="w-3 h-3 text-white" />
        ) : (
          <Clock className="w-3 h-3 text-white" />
        )}
      </div>
    </div>
  );
}
