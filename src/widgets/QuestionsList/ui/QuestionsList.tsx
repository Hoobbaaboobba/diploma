"use client";

import { Button } from "@/shared/ui/button";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Loader2, Plus } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import Question from "./Question";
import { Id } from "../../../../convex/_generated/dataModel";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";

interface QuestionsListProps {
  roomId: string | undefined;
}

export default function QuestionsList({ roomId }: QuestionsListProps) {
  // получем вопросы, относящиеся к комнате по room id
  // useQuery - convex функция
  const getQuestions = useQuery(api.questions.get, {
    roomId: roomId as Id<"Rooms">,
  });

  // получаем шаблоны вопросов
  const getQuestionTemplates = useQuery(api.questiontemplates.getQuestions);

  // кастомная функция convex, создаем вопрос
  const { mutate, pending } = useApiMutation(api.questions.create);

  // при нажатии на кнопку создается вопрос
  function onPlus() {
    return mutate({
      roomId: roomId,
    });
  }

  // если нет вопросов, показываем загрузку
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
            questions={getQuestionTemplates}
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
