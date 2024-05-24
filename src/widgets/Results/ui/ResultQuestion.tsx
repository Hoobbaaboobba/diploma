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
import { Currency, Heart } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import ReplyPopover from "./ReplyPopover";
import ReplyList from "./ReplyList";
import { Skeleton } from "@/shared/ui/skeleton";

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
  const getLikedPeople = useQuery(api.likedpeople.get);
  const getCurrentPlayer = useQuery(api.players.getCurrent, {
    playerId: userId,
    roomId: roomId as Id<"Rooms">,
  });

  const { mutate: updateAnswerLikes, pending: updateAnswerLikesPending } =
    useApiMutation(api.answers.updateLikes);
  const { mutate: updatePlayerLikes, pending: updatePlayerLikesPending } =
    useApiMutation(api.players.updateLikes);
  const { mutate: create, pending: createPending } = useApiMutation(
    api.likedpeople.create
  );
  const { mutate: like, pending: likePending } = useApiMutation(
    api.likedpeople.update
  );

  const loader =
    createPending ||
    likePending ||
    updateAnswerLikesPending ||
    updatePlayerLikesPending;

  if (!getLikedPeople || !getCurrentPlayer) {
    return null;
  }

  const answerLoading = getAnswers && (
    <>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
    </>
  );

  function onSave(answerId: Id<"Answers">) {
    if (!getLikedPeople || !getCurrentPlayer) {
      return null;
    }
    const likes = getLikedPeople.filter(
      (e) => e.answerId === answerId && e.userId === userId
    );

    if (
      likes.length === 0 &&
      getCurrentPlayer[0].likesAllowed !== 0
    ) {
      return create({
        userId: userId,
        answerId: answerId,
      })
        .then(() =>
          updateAnswerLikes({
            answerId: answerId,
            likes: true,
          })
        )
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: false,
          })
        );
    }

    if (likes[0].isLiked) {
      return like({
        likedPeopleId: likes[0]._id,
        isLiked: false,
      })
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: true,
          })
        )
        .then(() =>
          updateAnswerLikes({
            answerId: answerId,
            likes: false,
          })
        );
    }

    if (getCurrentPlayer[0].likesAllowed !== 0) {
      return like({
        likedPeopleId: likes[0]._id,
        isLiked: true,
      })
        .then(() =>
          updateAnswerLikes({
            answerId: answerId,
            likes: true,
          })
        )
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: false,
          })
        );
    }

    return null
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{questionContent}</CardTitle>
        <CardDescription>Quesetion {index + 1}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {getAnswers
          ? getAnswers
            .filter((e) => e.questionId === questionId)
            .map((answer) => (
              <div
                key={answer._id}
                className="w-full flex flex-col justify-center items-end"
              >
                <div className="w-full flex justify-between items-center">
                  <span>
                    {answer.playerName}: {answer.content}
                  </span>
                  <div className="flex gap-1 justify-center items-center">
                    <button
                      title="Like"
                      disabled={loader}
                      onClick={() => onSave(answer._id)}
                    >
                      <Heart
                        className={`${getLikedPeople?.filter((e) => e.answerId === answer._id && e.isLiked === true && e.userId === userId).length && "fill-rose-500 text-rose-500"} h-5 w-5`}
                      />
                    </button>
                    <span className="font-semibold w-3">
                      {answer.likesAmount}
                    </span>
                    {getCurrentPlayer[0].role === "Admin" && (
                      <ReplyPopover
                        userName={userName}
                        userId={userId}
                        answerId={answer._id}
                      />
                    )}
                  </div>
                </div>
                <ReplyList answerId={answer._id} userRole={getCurrentPlayer[0].role} />
              </div>
            ))
          : answerLoading}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
