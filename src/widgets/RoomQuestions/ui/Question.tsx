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
import { ChangeEvent, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Loader, Loader2, Plus, Trash } from "lucide-react";
import { useQuery } from "convex/react";
import { Skeleton } from "@/shared/ui/skeleton";

interface QuestionProps {
  QuestionId: Id<"Questions">;
  content: string;
  index: number;
  userId: string;
  roomId: string;
  playerName: string;
}

export default function Question({
  QuestionId,
  content,
  index,
  userId,
  roomId,
  playerName,
}: QuestionProps) {
  const [isLoader, setIsLoader] = useState(false);

  const { mutate, pending } = useApiMutation(api.answers.create);
  const { mutate: updateAnswer } = useApiMutation(
    api.answers.update
  );
  const { mutate: deleteAnswer, pending: deleteAnswerPending } = useApiMutation(
    api.answers.deleteAnswer
  );

  const getAnswers = useQuery(api.answers.get, {
    questionId: QuestionId,
  });

  const answersLoading = !getAnswers && (
    <Skeleton className="w-full px-4 h-9" />
  );

  function onSave(e: ChangeEvent<HTMLInputElement>, answerId: Id<"Answers">) {
    updateAnswer({
      answerId: answerId,
      content: e.target.value,
    });
    setIsLoader(true);
    setTimeout(() => {
      setIsLoader(false);
    }, 1000);
  }

  function MakeAnswer() {
    mutate({
      userId: userId,
      playerName: playerName,
      questionId: QuestionId,
      content: "",
      roomId: roomId,
    });
  }

  function onDelete(answerId: Id<"Answers">) {
    deleteAnswer({
      answerId: answerId,
    });
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {content}
          {isLoader && <Loader className="animate-spin w-4 h-4" />}
        </CardTitle>
        <CardDescription>Question {index + 1}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {getAnswers
          ? getAnswers
            ?.filter((e) => e.userId === userId)
            .map((answer) => (
              <div key={answer._id} className="flex gap-2">
                <Input
                  disabled={deleteAnswerPending}
                  defaultValue={answer.content}
                  onChange={(e) => onSave(e, answer._id)}
                />
                <Button
                  disabled={deleteAnswerPending}
                  onClick={() => onDelete(answer._id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash />
                </Button>
              </div>
            ))
          : answersLoading}
        <Button onClick={MakeAnswer}>
          Add answer
          {pending ? (
            <Loader2 className="animate-spin ml-1 h-5" />
          ) : (
            <Plus strokeWidth={1.5} className="ml-1 h-5" />
          )}
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
