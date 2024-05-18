"use client";

import { Button } from "@/shared/ui/button";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import Question from "./Question";
import { Skeleton } from "@/shared/ui/skeleton";

interface QuestionsListProps {
  roomId: string | undefined;
}

export default function QuestionsList({ roomId }: QuestionsListProps) {
  const { mutate, pending } = useApiMutation(api.questions.create);

  const getQuestions = useQuery(api.questions.get, {
    roomId: roomId as string,
  });

  function onPlus() {
    return mutate({
      roomId: roomId,
    });
  }

  if (!getQuestions) {
    return (
      <div className="w-full flex flex-col gap-10 justify-center items-center mt-10">
        <Skeleton className="w-[600px] h-[202px]" />
        <Skeleton className="w-[600px] h-[202px]" />
      </div>
    );
  }

  return (
    <>
      {getQuestions.map((question, index) => (
        <div
          key={question._id}
          className="flex flex-col items-center justify-center py-8"
        >
          <Question
            id={question._id}
            content={question.content}
            index={index}
          />
        </div>
      ))}
      <Button onClick={onPlus} variant="outline" size="icon" className="my-6">
        {pending ? <Loader2 className="animate-spin" /> : <PlusCircle />}
      </Button>
    </>
  );
}
