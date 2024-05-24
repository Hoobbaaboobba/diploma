"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Question from "./Question";
import { Button } from "@/shared/ui/button";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { FlagTriangleRight, Loader2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function RoomQuestions({ params, session }: RoomQuestionsProps) {
  const { mutate: updateIsAnswered, pending } = useApiMutation(
    api.players.updateAnswered
  );

  const getQuestions = useQuery(api.questions.get, {
    roomId: params.roomId as Id<"Rooms">,
  });
  const getCurrentUser = useQuery(api.players.getCurrent, {
    roomId: params.roomId as Id<"Rooms">,
    playerId: session.user.id,
  });

  if (!getCurrentUser) {
    return null;
  }
  if (getCurrentUser[0].isAnswered) {
    return redirect(`/results/${params.roomId}`);
  }

  if (!getQuestions) {
    return <LoaderAnimation />;
  }

  function onComplete() {
    if (!getCurrentUser) {
      return null
    }
    updateIsAnswered({
      playerId: getCurrentUser[0]._id,
      isAnswered: true,
    });
    return redirect(`/results/${params.roomId}`);
  }
  return (
    <div className="flex flex-col gap-8 container justify-center items-end mt-10">
      {getQuestions.map((question, index) => (
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
