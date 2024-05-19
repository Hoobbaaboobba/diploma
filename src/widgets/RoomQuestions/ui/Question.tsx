"use client";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
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

  const getAnswers = useQuery(api.answers.get, {
    questionId: id as Id<"Questions">,
  });

  function onSave(questionId: Id<"Questions">) {
    if (getAnswers?.filter((e) => e._id))
      return mutate({
        userId: userId,
        questionId: questionId,
        content: questionValue,
      });
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Question {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Input
          onBlur={() => onSave(id)}
          defaultValue={content}
          onChange={(e) => setQuestionValue(e.target.value)}
          className={`${questionValue === content && content.length > 0 && "border-emerald-400"}`}
        />
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
