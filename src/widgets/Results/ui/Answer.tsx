import { Volume2 } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import ReplyList from "./ReplyList";
import GroupPopover from "./GroupPopover";

interface AnswerProps {
  answerId: Id<"Answers">;
  answerPlayerName: string;
  answerContent: string;
  playerRole: string;
  groupId: string;
  roomId: string;
  questionId: Id<"Questions">;
  isVoteStarted: boolean;
  answersNotInGroups: Doc<"Groups">[];
}

export default function Answer({
  answerId,
  answerContent,
  answerPlayerName,
  playerRole,
  groupId,
  roomId,
  questionId,
  isVoteStarted,
  answersNotInGroups,
}: AnswerProps) {
  return (
    <div
      key={answerId}
      className={`w-full flex flex-col justify-center items-end rounded-md`}
    >
      <div className="w-full text-lg flex justify-between items-center">
        <span className="flex justify-center items-center">
          <Volume2 className="w-4 h-4 mr-1" /> {answerPlayerName}:{" "}
          <span className="italic">«{answerContent}»</span>
        </span>
        <div className="flex gap-1 justify-center items-center">
          {playerRole === "Admin" && !isVoteStarted && (
            <GroupPopover
              answersNotInGroups={answersNotInGroups}
              groupId={groupId}
              roomId={roomId}
              questionId={questionId}
              answerId={answerId}
            />
          )}
        </div>
      </div>
      <ReplyList answerId={answerId} userRole={playerRole} />
    </div>
  );
}
