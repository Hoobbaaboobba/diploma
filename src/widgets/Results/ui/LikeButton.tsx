"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Heart } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface LikeButtonProps {
  userId: string;
  roomId: string;
  groupId: Id<"Groups">;
  groupLikes: number;
}

export default function LikeButton({
  userId,
  roomId,
  groupId,
  groupLikes,
}: LikeButtonProps) {
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

  const getLikedPeople = useQuery(api.likedpeople.get);
  const getCurrentPlayer = useQuery(api.players.getCurrent, {
    playerId: userId,
    roomId: roomId as Id<"Rooms">,
  });

  const loader =
    createPending ||
    likePending ||
    updateAnswerLikesPending ||
    updatePlayerLikesPending;

  if (!getLikedPeople) {
    return null;
  }

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
    <div className="flex gap-1 justify-center items-center absolute -translate-y-1/2 top-1/2 right-3">
      <button title="Like" disabled={loader} onClick={() => onSave(groupId)}>
        <Heart
          className={`${getLikedPeople.filter((e) => e.groupId === groupId && e.isLiked === true && e.userId === userId).length && "fill-rose-500 text-rose-500"} h-5 w-5`}
        />
      </button>
      <span className="font-semibold w-3">{groupLikes}</span>
    </div>
  );
}
