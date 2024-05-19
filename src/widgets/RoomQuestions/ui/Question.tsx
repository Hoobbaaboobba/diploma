"use client";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Check, Loader2, Trash } from "lucide-react";
import { useQuery } from "convex/react";

interface QuestionProps {
  id: Id<"Questions">;
  content: string;
  index: number;
  userId: string;
}

export default function Question({
  id,
  content,
  index,
  userId,
}: QuestionProps) {
  const [questionValue, setQuestionValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { mutate, pending } = useApiMutation(api.answers.create);
  const { mutate: updateAnswer, pending: updateAnswerPending } = useApiMutation(
    api.answers.update
  );

  const getAnswers = useQuery(api.answers.get, {
    questionId: id,
  });

  function onSave(questionId: Id<"Questions">) {
    if (!getAnswers) {
      return null;
    }

    return updateAnswer({
      answerId: getAnswers.map((e) => e._id).toString,
    });
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {content}
        </CardTitle>
        <CardDescription>Question {index + 1}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {getAnswers?.map((e) => (
          <Input
            onBlur={() => onSave(id)}
            key={e._id}
            defaultValue={content}
            onChange={(e) => setQuestionValue(e.target.value)}
            className={`${questionValue === content && content.length > 0 && "border-emerald-400"}`}
          />
        ))}
        {questionValue === content && content.length > 0 && (
          <div className="absolute text-sm flex justify-center items-center top-3 right-8">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
