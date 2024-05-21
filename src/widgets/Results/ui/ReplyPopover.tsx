"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Ellipsis, Loader2, Send } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface ReplyPopoverProps {
  userName: string;
  userId: string;
  answerId: Id<"Answers">;
}

export default function ReplyPopover({
  userName,
  userId,
  answerId,
}: ReplyPopoverProps) {
  const [replyValue, setReplyValue] = useState("");

  const { mutate, pending } = useApiMutation(api.replies.create);

  function onReply() {
    mutate({
      userName: userName,
      userId: userId,
      content: replyValue,
      answerId: answerId,
    });
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button title="Reply">
          <Ellipsis />
        </button>
      </PopoverTrigger>
      <PopoverContent className="mr-[200px]">
        <form action={onReply} className="flex gap-2">
          <Input
            onChange={(e) => setReplyValue(e.target.value)}
            placeholder="Reply"
          />
          <Button type="submit" size="icon">
            {pending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
