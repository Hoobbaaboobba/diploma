"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Ellipsis, Loader, Loader2, Send } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface ReplyPopoverProps {
  userName: string;
  userId: string;
  groupId: Id<"Groups">;
}

export default function ReplyPopover({
  userName,
  userId,
  groupId,
}: ReplyPopoverProps) {
  const [replyContent, setReplyContent] = useState<string>();
  const [isShow, setIsShow] = useState(false);

  const popoverRef = useRef<any>(null);

  const { mutate: makeReply } = useApiMutation(api.replies.create);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function onReply() {
    setIsShow(false);
    setReplyContent("");

    if (replyContent && replyContent.length > 0) {
      makeReply({
        userName: userName,
        userId: userId,
        content: replyContent,
        groupId: groupId,
      });
    }
  }

  return (
    <div ref={popoverRef}>
      <Popover
        open={isShow}
        onOpenChange={() => {
          setIsShow(true);
          setReplyContent("");
        }}
      >
        <PopoverTrigger asChild className="cursor-pointer">
          <Ellipsis />
        </PopoverTrigger>
        <PopoverContent>
          <form action={onReply} className="flex gap-2">
            <Input onChange={(e) => setReplyContent(e.target.value)} />
            <Button type="submit" size="icon">
              <Send />
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
