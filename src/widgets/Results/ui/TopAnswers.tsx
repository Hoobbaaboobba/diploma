"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CornerDownLeft, Download, Heart, Loader2, Plus } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { colors } from "./colors";
import ReplyPopover from "./ReplyPopover";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";

import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Button } from "@/shared/ui/button";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";
import { Skeleton } from "@/shared/ui/skeleton";

interface TopAnswersProps {
  roomId: string;
  userId: string;
  userName: string;
  userRole: string;
}

export default function TopAnswers({
  roomId,
  userId,
  userName,
  userRole,
}: TopAnswersProps) {
  const getAnswers = useQuery(api.answers.getByRoom, {
    roomId: roomId as Id<"Rooms">,
  });
  const getGroups = useQuery(api.groups.getAllGroups);
  const getReplies = useQuery(api.replies.getByGroupId);

  const ref = useRef<any>();
  const { mutate: deleteReply } = useApiMutation(api.replies.deleteReply);

  if (!getGroups || !getAnswers) {
    return (
      <div className="w-full container p-0 flex flex-col gap-10 justify-center items-center mt-10">
        <Skeleton className="w-full h-[400px]" />
      </div>
    );
  }

  async function handleDowloadPDF() {
    try {
      if (ref.current === undefined) {
        return;
      }
      if (!getAnswers || !getGroups) {
        return null;
      }
      const dataUrl = await toPng(ref.current);
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, getAnswers.length * 22);
      pdf.save("TopAnswers.pdf");
    } catch (err) {
      console.error("Error capturing screenshot:", err);
    }
  }

  function onRemoveReply(replyId: Id<"Replies">) {
    deleteReply({
      replyId: replyId,
    });
  }
  return (
    <Card ref={ref}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Top Answers</span>
          <Button title="download pdf" onClick={handleDowloadPDF} size="icon">
            <Download />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {getGroups
          .sort((a, b) => b.likes - a.likes)
          .map((group, index) =>
            getAnswers.filter((e) => e.groupId === group.groupId).length > 1 ? (
              <div key={group._id}>
                <div
                  className={`relative rounded-md py-1 px-2 border ${colors[index]}`}
                >
                  {getAnswers.map(
                    (answer) =>
                      group.groupId === answer.groupId && (
                        <>
                          <div key={answer._id}>
                            {answer.playerName}:{" "}
                            <span className="italic">«{answer.content}»</span>
                          </div>
                        </>
                      )
                  )}
                  <div className="flex gap-1 justify-center items-center absolute -translate-y-1/2 top-1/2 right-3">
                    <div>
                      <Heart className={`h-5 w-5`} />
                    </div>
                    <span className="font-semibold w-3">{group.likes}</span>
                    {userRole === "Admin" && (
                      <ReplyPopover
                        userName={userName}
                        userId={userId}
                        groupId={group._id}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end mr-3">
                  {getReplies
                    ?.filter((e) => e.groupId === group._id)
                    .map((reply) => (
                      <div
                        key={reply._id}
                        className="flex justify-center items-center gap-1 mt-1"
                      >
                        <span>{reply.userName}</span>:{" "}
                        <span className="italic">«{reply.content}»</span>
                        <CornerDownLeft className="w-5 h-5" />
                        {userRole === "Admin" && (
                          <button onClick={() => onRemoveReply(reply._id)}>
                            <Plus className="rotate-45 w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div key={group._id} className="relative">
                {getAnswers.map(
                  (answer) =>
                    group.groupId === answer.groupId && (
                      <>
                        <div>
                          <div
                            key={answer._id}
                            className="relative rounded-md py-1 px-2 border"
                          >
                            {answer.playerName}:{" "}
                            <span className="italic">«{answer.content}»</span>
                            <div className="flex gap-1 justify-center items-center absolute -translate-y-1/2 top-1/2 right-3">
                              <div>
                                <Heart className={`h-5 w-5`} />
                              </div>
                              <span className="font-semibold w-3">
                                {group.likes}
                              </span>
                              {userRole === "Admin" && (
                                <ReplyPopover
                                  userName={userName}
                                  userId={userId}
                                  groupId={group._id}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end mr-3">
                            {getReplies
                              ?.filter((e) => e.groupId === group._id)
                              .map((reply) => (
                                <div
                                  key={reply._id}
                                  className="flex justify-center items-center gap-1 mt-1"
                                >
                                  <span>{reply.userName}</span>:{" "}
                                  <span className="italic">
                                    «{reply.content}»
                                  </span>
                                  <CornerDownLeft className="w-5 h-5" />
                                  {userRole === "Admin" && (
                                    <button
                                      onClick={() => onRemoveReply(reply._id)}
                                    >
                                      <Plus className="rotate-45 w-5 h-5" />
                                    </button>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </>
                    )
                )}
              </div>
            )
          )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
