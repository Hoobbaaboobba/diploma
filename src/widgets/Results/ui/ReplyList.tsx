"use client";

import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Plus, Reply } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";

interface ReplyListProps {
  answerId: Id<"Answers">;
  userRole: string;
}

export default function ReplyList({ answerId, userRole }: ReplyListProps) {
  const getReplies = useQuery(api.replies.getByAnswerId, {
    answerId: answerId,
  });

  const { mutate, pending } = useApiMutation(api.replies.deleteReply);

  if (!getReplies) {
    return null;
  }

  function onDelete(replyId: Id<"Replies">) {
    return mutate({
      replyId: replyId,
    });
  }

  return getReplies?.map((reply) => (
    <div key={reply._id} className="flex gap-1 justify-center items-center">
      {reply.userName}: {reply.content} <Reply />{" "}
      {userRole === "Admin" && (
        <button disabled={pending} onClick={() => onDelete(reply._id)}>
          <Plus className="rotate-45 w-5 h-5" />
        </button>
      )}
    </div>
  ));
}
