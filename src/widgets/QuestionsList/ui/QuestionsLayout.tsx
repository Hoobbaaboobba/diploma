"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { QuestionsList } from "@/widgets/QuestionsList";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/shared/ui/skeleton";

interface QuestionsLayout {
  params: {
    createId: string;
  };
  session: any;
}

export default function QuestionsLayout({ params, session }: QuestionsLayout) {
  const [icebergValue, setIcebergValue] = useState("");

  const router = useRouter();

  const getRoom = useQuery(api.rooms.getRoom, {
    createId: params.createId,
  });
  const { mutate, pending } = useApiMutation(api.rooms.createIcebergQuestion);
  const { mutate: updateStart, pending: pendingStart } = useApiMutation(
    api.rooms.updateStart
  );
  const { mutate: createPlayer } = useApiMutation(api.players.create);

  const roomId = getRoom?.map((e) => e._id).toString();

  function onSaveIceberg() {
    return mutate({
      roomId: roomId,
      icebergQuestionContent: icebergValue,
    });
  }

  function onStart() {
    createPlayer({
      name: session.user.name,
      playerId: session.user.id,
      roomId: roomId,
      role: "Admin",
      isReady: false,
    });
    updateStart({
      roomId: roomId,
      isStart: true,
    }).then(() => router.push(`/rooms/${roomId}`));
  }

  if (!getRoom) {
    return (
      <div className="container mt-10">
        <Skeleton className="w-full h-[202px]" />
      </div>
    );
  }

  return (
    <div className="flex container flex-col items-center justify-center py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Do you want to make an Icebergquestion?</CardTitle>
          <CardDescription>It is not important!</CardDescription>
        </CardHeader>
        <CardContent>
          <Input onChange={(e) => setIcebergValue(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button onClick={onSaveIceberg} className="w-[60px]">
            {pending ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </CardFooter>
      </Card>
      <QuestionsList roomId={roomId} />
      <Button onClick={onStart}>
        {pendingStart ? <Loader2 className="animate-spin" /> : "Start"}
      </Button>
    </div>
  );
}
