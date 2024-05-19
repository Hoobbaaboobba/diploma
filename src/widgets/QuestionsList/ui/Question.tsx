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

interface QuestionProps {
  id: Id<"Questions">;
  content: string;
  index: number;
}

export default function Question({ id, content, index }: QuestionProps) {
  const [questionValue, setQuestionValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: deleteQ, pending: pendingDeleteQ } = useApiMutation(
    api.questions.deleteQ
  );

  const { mutate: updateQ, pending: pendingUpdateQ } = useApiMutation(
    api.questions.update
  );

  function onDelete(questionId: Id<"Questions">) {
    return deleteQ({
      questionId: questionId,
    });
  }

  function onSave(questionId: Id<"Questions">) {
    setIsSaved(true);
    return updateQ({
      questionId: questionId,
      content: questionValue,
    });
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Input
          disabled={pendingUpdateQ}
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
      <CardFooter className="flex justify-between">
        <Button
          disabled={pendingUpdateQ || questionValue.length === 0}
          onClick={() => onSave(id)}
          className="w-[60px]"
        >
          {pendingUpdateQ ? <Loader2 className="animate-spin" /> : "Save"}
        </Button>
        <Button
          disabled={pendingDeleteQ}
          onClick={() => onDelete(id)}
          variant="destructive"
          size="icon"
        >
          {pendingDeleteQ ? <Loader2 className="animate-spin" /> : <Trash />}
        </Button>
      </CardFooter>
    </Card>
  );
}
