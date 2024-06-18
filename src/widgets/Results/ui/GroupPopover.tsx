"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Ellipsis, Loader, Loader2, Send } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useQuery } from "convex/react";

interface ReplyPopoverProps {
  answersNotInGroups?: Doc<"Groups">[];
  questionId: Id<"Questions">;
  roomId: string;
  answerId: Id<"Answers">;
  groupId: string;
}

export default function GroupPopover({
  answersNotInGroups,
  questionId,
  roomId,
  answerId,
  groupId,
}: ReplyPopoverProps) {
  const getGroups = useQuery(api.groups.getGroupsByQuestionId, {
    questionId: questionId,
  });
  const getAnswers = useQuery(api.answers.getByRoom, {
    roomId: roomId as Id<"Rooms">,
  });

  const { mutate: updateAnswer, pending: updateAnswerPending } = useApiMutation(
    api.answers.updateGroupId
  );

  if (!getGroups || !getAnswers) {
    return null;
  }

  function onAddTo(groupId: string) {
    updateAnswer({
      answerId: answerId,
      groupId: groupId,
    });
  }

  function onRemove(answerId: Id<"Answers">) {
    if (!getGroups) {
      return null;
    }
    updateAnswer({
      answerId: answerId,
      groupId: answersNotInGroups?.map((e) => e.groupId)[0],
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {getGroups
            .filter((e) => e.questionId === questionId)
            .map((group, index) =>
              getAnswers.map(
                (answer) =>
                  group.groupId === answer.groupId &&
                  groupId !== group.groupId && (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => onAddTo(group.groupId)}
                    >
                      Add to {answer.content}
                    </DropdownMenuItem>
                  )
              )
            )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onRemove(answerId)}>
            Remove from group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
