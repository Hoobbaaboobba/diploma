"use client";

import { useQuery } from "convex/react";
import { Check, CircleHelp, Clock, Loader2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ResultsList from "@/widgets/Results/ui/ResultsList";
import LoaderAnimation from "@/shared/ui/LoaderAnimation";
import { Button } from "@/shared/ui/button";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import WaitingPlayer from "./WaitingPlayer";
import RenderPlayers from "./RenderPlayers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import TopAnswers from "./TopAnswers";
import { redirect } from "next/navigation";

interface ResultsLayoutProps {
  roomId: string;
  session: any;
}

export default function ResultsLayout({ roomId, session }: ResultsLayoutProps) {
  const getPlayers = useQuery(api.players.get, {
    roomId: roomId as Id<"Rooms">,
  });
  const getRoom = useQuery(api.rooms.getRoomById, {
    roomId: roomId as Id<"Rooms">,
  });

  const { mutate: updateVote, pending } = useApiMutation(api.rooms.updateVote);
  const { mutate: endVote, pending: endVotePending } = useApiMutation(
    api.rooms.endVote
  );
  const { mutate: endMeeting, pending: endMeetingPending } = useApiMutation(
    api.rooms.endMeeting
  );

  if (getRoom?.isMeetingEnd) {
    return redirect("/");
  }

  if (!getPlayers || !getRoom) {
    return <LoaderAnimation />;
  }

  const isEveryBodyAnswerd =
    getPlayers.length ===
    getPlayers.filter((e) => e.isAnswered === true).length;

  const getCurrentPlayer = getPlayers.filter(
    (e) => e.playerId === session.user.id
  )[0];

  function onStartVote() {
    updateVote({
      roomId: roomId as Id<"Rooms">,
      isVoteStarted: true,
    });
  }
  function onEndVote() {
    endVote({
      roomId: roomId as Id<"Rooms">,
      isVoteEnd: true,
    });
  }
  function onEndMeeting() {
    endMeeting({
      roomId: roomId as Id<"Rooms">,
    });
  }

  if (!isEveryBodyAnswerd) {
    return (
      <RenderPlayers roomId={roomId} isEveryBodyAnswerd={isEveryBodyAnswerd} />
    );
  }

  return (
    <div className="container my-10 space-y-8">
      {!getRoom.isVoteEnd && (
        <>
          {getRoom.icebreakerQuestionContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-1 justify-start items-center">
                  <CircleHelp className="w-8 h-8" />{" "}
                  <span>Icebreaker question</span>
                </CardTitle>
              </CardHeader>
              <CardContent>{getRoom.icebreakerQuestionContent}</CardContent>
              <CardFooter></CardFooter>
            </Card>
          )}
          <ResultsList
            roomId={roomId}
            userId={session.user.id}
            userName={session.user.name}
          />
        </>
      )}

      {getRoom.isVoteEnd && (
        <TopAnswers
          roomId={roomId}
          userId={session.user.id}
          userName={session.user.name}
          userRole={getCurrentPlayer.role}
        />
      )}

      {!getRoom.isVoteStarted && getCurrentPlayer.role === "Admin" && (
        <Button disabled={pending} onClick={onStartVote} className="w-full">
          {pending ? <Loader2 className="animate-spin" /> : "Start vote"}
        </Button>
      )}

      {getRoom.isVoteStarted &&
        !getRoom.isVoteEnd &&
        getCurrentPlayer.role === "Admin" && (
          <Button
            disabled={endVotePending}
            onClick={onEndVote}
            className="w-full"
          >
            {endVotePending ? <Loader2 className="animate-spin" /> : "End vote"}
          </Button>
        )}
      {getRoom.isVoteEnd && getCurrentPlayer.role === "Admin" && (
        <Button onClick={onEndMeeting} className="w-full" variant="destructive">
          {endMeetingPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "End Meeting"
          )}
        </Button>
      )}
    </div>
  );
}
