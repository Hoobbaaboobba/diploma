"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import Question from "./Question";

interface RoomQuestionsProps {
  params: {
    roomId: string;
  };
  session: any;
}

export default function RoomQuestions({ params, session }: RoomQuestionsProps) {
  const getQuestion = useQuery(api.questions.get, {
    roomId: params.roomId as Id<"Rooms">,
  });
  return (
    <div className="flex flex-col gap-8 container justify-center items-center mt-10">
      {getQuestion?.map((question, index) => (
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
