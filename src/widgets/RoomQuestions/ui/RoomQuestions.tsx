"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Question from "./Question";
import { Button } from "@/shared/ui/button";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { FlagTriangleRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function RoomQuestions({ params, session }: RoomQuestionsProps) {
  const getQuestions = useQuery(api.questions.get, {
    roomId: params.roomId as Id<"Rooms">,
  });

  const { mutate: updateIsAnswered, pending } = useApiMutation(
    api.players.updateAnswered
  );

  const getCurrentUser = useQuery(api.players.getCurrent, {
    roomId: params.roomId as Id<"Rooms">,
    playerId: session.user.id,
  });

  const router = useRouter();

  function onComplete() {
    updateIsAnswered({
      playerId: getCurrentUser?.map((e) => e._id).toString() as Id<"Players">,
      isAnswered: true,
    }).then(() => router.push(`/results/${params.roomId}`));
  }

  return (
    <div className="flex flex-col gap-8 container justify-center items-end mt-10">
      {getQuestions?.map((question, index) => (
        <Question
          key={question._id}
          QuestionId={question._id}
          content={question.content}
          index={index}
          userId={session.user.id}
          roomId={params.roomId}
          playerName={session.user.name}
        />
      ))}
      <Button onClick={onComplete}>
        Complete
        {pending ? (
          <Loader2 className="animate-spin w-5 h-5 ml-1" />
        ) : (
          <FlagTriangleRight strokeWidth={1.5} className="ml-1 w-5 h-5" />
        )}
      </Button>
    </div>
  );
}
