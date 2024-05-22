"use client";

import { Button } from "@/shared/ui/button";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, Plus, PlusCircle, Trash } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import Question from "./Question";
import { Skeleton } from "@/shared/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";

interface QuestionsListProps {
  roomId: string | undefined;
}

export default function QuestionsList({ roomId }: QuestionsListProps) {
  const getQuestions = useQuery(api.questions.get, {
    roomId: roomId as Id<"Rooms">,
  });

  const { mutate, pending } = useApiMutation(api.questions.create);

  function onPlus() {
    return mutate({
      roomId: roomId,
    });
  }

  if (!getQuestions) {
    return <LoaderAnimation />;
  }

  return (
    <div className="container p-0 space-y-8">
      {getQuestions.map((question, index) => (
        <div
          key={question._id}
          className="flex flex-col items-center justify-center"
        >
          <Question
            id={question._id}
            content={question.content}
            index={index}
          />
        </div>
      ))}
      <div className="flex justify-center items-center">
        <Button onClick={onPlus} variant="outline" className="w-[150px]">
          Add question
          {pending ? (
            <Loader2 className="animate-spin ml-1" />
          ) : (
            <Plus className="ml-[2px]" />
          )}
        </Button>
      </div>
    </div>
  );
}
