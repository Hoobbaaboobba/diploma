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
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Check, Lightbulb, Loader2, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";

interface QuestionProps {
  id: Id<"Questions">;
  content: string;
  index: number;
  questions: Doc<"QuestionTemplates">[] | undefined;
}

export default function Question({
  id,
  content,
  index,
  questions,
}: QuestionProps) {
  // Состояание, которое берется из инпута icebreaker question
  const [questionValue, setQuestionValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const { mutate: deleteQ, pending: pendingDeleteQ } = useApiMutation(
    api.questions.deleteQ
  );

  const { mutate: updateQ } = useApiMutation(api.questions.update);

  function onDelete(questionId: Id<"Questions">) {
    return deleteQ({
      questionId: questionId,
    });
  }

  function onSave() {
    updateQ({
      questionId: id,
      content: questionValue,
    });
    setShowSuggestions(false);
  }

  function onSelect(value: string) {
    setQuestionValue(value);
    updateQ({
      questionId: id,
      content: value,
    });
    setShowSuggestions(false);
  }

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Question {index + 1}{" "}
          <Button
            disabled={pendingDeleteQ}
            onClick={() => onDelete(id)}
            variant="destructive"
            size="icon"
          >
            {pendingDeleteQ ? <Loader2 className="animate-spin" /> : <Trash />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex gap-2">
        <Input
          onBlur={onSave}
          value={questionValue}
          onChange={(e) => setQuestionValue(e.target.value)}
          className={`${questionValue === content && content.length > 0 && "border-emerald-400"}`}
        />
        {questionValue === content && content.length > 0 && (
          <div className="absolute text-sm flex justify-center items-center top-3 right-20">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
        <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
          <PopoverTrigger asChild>
            <Button
              className="border border-yellow-400"
              variant="outline"
              role="combobox"
              size="icon"
              aria-expanded={showSuggestions}
            >
              {<Lightbulb className="w-5 h-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[490px] absolute -right-6">
            <Command>
              <CommandInput placeholder="Search question..." />
              <CommandList>
                <CommandEmpty>No question found.</CommandEmpty>
                <CommandGroup>
                  {!questions ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    questions.map((question, index) => (
                      <CommandItem
                        key={question.content}
                        value={question.content}
                        onSelect={(currentValue) => {
                          onSelect(currentValue);
                        }}
                      >
                        {index + 1}.- {question.content}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
