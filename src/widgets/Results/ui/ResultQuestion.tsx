"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { CircleHelp } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { colors } from "./colors";
import LikeButton from "./LikeButton";
import Answer from "./Answer";

interface ResultQuestionProps {
  index: number;
  roomId: string;
  userId: string;
  userName: string;
  questionId: Id<"Questions">;
  questionContent: string;
}

export default function ResultQuestion({
  index,
  roomId,
  userName,
  userId,
  questionId,
  questionContent,
}: ResultQuestionProps) {
  const getAnswers = useQuery(api.answers.getByRoom, {
    roomId: roomId as Id<"Rooms">,
  });
  const getGroups = useQuery(api.groups.getGroupsByQuestionId, {
    questionId: questionId,
  });
  const getLikedPeople = useQuery(api.likedpeople.get);
  const getCurrentPlayer = useQuery(api.players.getCurrent, {
    playerId: userId,
    roomId: roomId as Id<"Rooms">,
  });
  const getRoom = useQuery(api.rooms.getRoomById, {
    roomId: roomId as Id<"Rooms">,
  });

  if (!getLikedPeople || !getCurrentPlayer || !getRoom) {
    return null;
  }

  if (!getAnswers || !getGroups) {
    return (
      <>
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
      </>
    );
  }

  const answersNotInGroups = getGroups.filter(
    (group) => !getAnswers.some((answer) => answer.groupId === group.groupId)
  );

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex gap-1 justify-start items-start">
          <span>{questionContent}</span>
        </CardTitle>
        <CardDescription>Quesetion {index + 1}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {getGroups.map((group, index) =>
          getAnswers.filter((e) => e.groupId === group.groupId).length > 1 ? (
            <div
              key={group._id}
              className={`relative rounded-md py-1 px-2 border ${colors[index]}`}
            >
              {getAnswers.map(
                (answer) =>
                  group.groupId === answer.groupId && (
                    <Answer
                      key={answer._id}
                      answerId={answer._id}
                      answerPlayerName={answer.playerName}
                      answerContent={answer.content}
                      playerRole={getCurrentPlayer[0].role}
                      groupId={group.groupId}
                      roomId={roomId}
                      questionId={questionId}
                      isVoteStarted={getRoom.isVoteStarted}
                      answersNotInGroups={answersNotInGroups}
                    />
                  )
              )}
              {getRoom.isVoteStarted && (
                <LikeButton
                  userId={userId}
                  roomId={roomId}
                  groupId={group._id}
                  groupLikes={group.likes}
                />
              )}
            </div>
          ) : (
            <div key={group._id} className="relative">
              {getAnswers.map(
                (answer) =>
                  group.groupId === answer.groupId && (
                    <div key={answer._id}>
                      <Answer
                        key={answer._id}
                        answerId={answer._id}
                        answerPlayerName={answer.playerName}
                        answerContent={answer.content}
                        playerRole={getCurrentPlayer[0].role}
                        groupId={group.groupId}
                        roomId={roomId}
                        questionId={questionId}
                        isVoteStarted={getRoom.isVoteStarted}
                        answersNotInGroups={answersNotInGroups}
                      />
                      {getRoom.isVoteStarted && (
                        <LikeButton
                          userId={userId}
                          roomId={roomId}
                          groupId={group._id}
                          groupLikes={group.likes}
                        />
                      )}
                    </div>
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
