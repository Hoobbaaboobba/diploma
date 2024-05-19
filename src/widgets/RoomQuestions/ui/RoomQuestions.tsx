"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Question from "./Question";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { useEffect } from "react";

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

  const getAnswers = useQuery(api.answers.getByRoom, {
    roomId: params.roomId as Id<"Rooms">,
  });

  const { mutate: createAnswers } = useApiMutation(api.answers.create);

  useEffect(() => {
    if (getAnswers?.length === 0 && getQuestions) {
      for (let i = 0; i < getQuestions.length; i++) {
        createAnswers({
          userId: session.user.id,
          questionId: getQuestions[i]._id,
          content: getQuestions[i]._id,
          roomId: params.roomId,
        });
      }
    }
  }, [
    createAnswers,
    getAnswers?.length,
    getQuestions,
    params.roomId,
    session.user.id,
  ]);

  return (
    <div className="flex flex-col gap-8 container justify-center items-center mt-10">
      {getQuestions?.map((question, index) => (
        <Question
          key={question._id}
          id={question._id}
          content={question.content}
          index={index}
          userId={session.user.id}
        />
      ))}
    </div>
  );
}
