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
import { CircleHelp, Currency, Heart, Loader, Volume2 } from "lucide-react";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import ReplyPopover from "./ReplyPopover";
import ReplyList from "./ReplyList";
import { Skeleton } from "@/shared/ui/skeleton";
import { colors } from "./colors";

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

  const { mutate: updateGroupLikes, pending: updateAnswerLikesPending } =
    useApiMutation(api.groups.updateLikes);
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

  if (!getLikedPeople || !getCurrentPlayer || !getRoom) {
    return null;
  }

  const answerLoading = getAnswers && (
    <>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-full h-6" />
    </>
  );

  if (!getAnswers || !getGroups) {
    return answerLoading;
  }

  const answersNotInGroups = getGroups.filter(
    (group) => !getAnswers.some((answer) => answer.groupId === group.groupId)
  );

  function onSave(groupId: Id<"Groups">) {
    if (!getLikedPeople || !getCurrentPlayer) {
      return null;
    }
    const likes = getLikedPeople.filter(
      (e) => e.groupId === groupId && e.userId === userId
    );

    if (likes.length === 0 && getCurrentPlayer[0].likesAllowed !== 0) {
      return create({
        userId: userId,
        groupId: groupId,
      })
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: false,
          })
        )
        .then(() =>
          updateGroupLikes({
            groupId: groupId,
            likes: true,
          })
        );
    }

    if (likes[0].isLiked) {
      return updateGroupLikes({
        groupId: groupId,
        likes: false,
      })
        .then(() =>
          like({
            likedPeopleId: likes[0]._id,
            isLiked: false,
          })
        )
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: true,
          })
        );
    }

    if (getCurrentPlayer[0].likesAllowed !== 0) {
      return updateGroupLikes({
        groupId: groupId,
        likes: true,
      })
        .then(() =>
          like({
            likedPeopleId: likes[0]._id,
            isLiked: true,
          })
        )
        .then(() =>
          updatePlayerLikes({
            playerId: getCurrentPlayer[0]._id,
            likes: false,
          })
        );
    }

    return null;
  }
  return (
    <Card className="relative">
      {loader && <Loader className="animate-spin absolute top-5 right-5" />}
      <CardHeader>
        <CardTitle className="flex gap-1 items-center">
          <CircleHelp /> {questionContent}
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
                    <div
                      key={answer._id}
                      className={`w-full flex flex-col justify-center items-end rounded-md`}
                    >
                      <div className="w-full flex justify-between items-center">
                        <span className="flex justify-center items-center">
                          <Volume2 className="w-4 h-4 mr-1" />{" "}
                          {answer.playerName}:{" "}
                          <span className="italic">«{answer.content}»</span>
                        </span>
                        <div className="flex gap-1 justify-center items-center">
                          {getCurrentPlayer[0].role === "Admin" &&
                            !getRoom.isVoteStarted && (
                              <ReplyPopover
                                answersNotInGroups={answersNotInGroups}
                                groupId={group.groupId}
                                roomId={roomId}
                                questionId={questionId}
                                answerId={answer._id}
                              />
                            )}
                        </div>
                      </div>
                      <ReplyList
                        answerId={answer._id}
                        userRole={getCurrentPlayer[0].role}
                      />
                    </div>
                  )
              )}
              {getRoom.isVoteStarted && (
                <>
                  <div className="absolute flex gap-1 justify-center items-center right-9 -translate-y-1/2 top-[50%]">
                    <button
                      title="Like"
                      disabled={loader}
                      onClick={() => onSave(group._id)}
                    >
                      <Heart
                        className={`${getLikedPeople?.filter((e) => e.groupId === group._id && e.isLiked === true && e.userId === userId).length && "fill-rose-500 text-rose-500"} h-5 w-5`}
                      />
                    </button>
                    <span className="font-semibold w-3">{group.likes}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div key={group._id}>
              {getAnswers.map(
                (answer) =>
                  group.groupId === answer.groupId && (
                    <div
                      key={answer._id}
                      className={`w-full flex flex-col justify-center items-end rounded-md`}
                    >
                      <div className="w-full flex justify-between items-center">
                        <span className="flex justify-center items-center">
                          <Volume2 className="w-4 h-4 mr-1" />{" "}
                          {answer.playerName}:{" "}
                          <span className="italic">«{answer.content}»</span>
                        </span>
                        <div className="flex gap-1 justify-center items-center">
                          {getRoom.isVoteStarted && (
                            <>
                              <button
                                title="Like"
                                disabled={loader}
                                onClick={() => onSave(group._id)}
                              >
                                <Heart
                                  className={`${getLikedPeople?.filter((e) => e.groupId === group._id && e.isLiked === true && e.userId === userId).length && "fill-rose-500 text-rose-500"} h-5 w-5`}
                                />
                              </button>
                              <span className="font-semibold w-3">
                                {group.likes}
                              </span>
                            </>
                          )}
                          {getCurrentPlayer[0].role === "Admin" &&
                            !getRoom.isVoteStarted && (
                              <ReplyPopover
                                groupId={group.groupId}
                                roomId={roomId}
                                questionId={questionId}
                                answerId={answer._id}
                              />
                            )}
                        </div>
                      </div>
                      <ReplyList
                        answerId={answer._id}
                        userRole={getCurrentPlayer[0].role}
                      />
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
