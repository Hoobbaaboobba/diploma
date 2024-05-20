"use client";

import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface SetTimeProps {
  createId: string;
}

export default function SetTime({ createId }: SetTimeProps) {
  const [timeValue, setTimeValue] = useState("");

  const { mutate: setTime, pending } = useApiMutation(api.rooms.updateTimer);
  const getRoom = useQuery(api.rooms.getRoomByCreateId, {
    createId: createId,
  });

  const getRoomById = useQuery(api.rooms.getRoomById, {
    roomId: getRoom?.map((e) => e._id).toString() as Id<"Rooms">,
  });

  if (!getRoomById) {
    return null;
  }

  function onSetTime() {
    setTime({
      roomId: getRoomById?._id,
      time: Number(timeValue),
    });
  }
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Set time (s)</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          defaultValue={getRoom?.map((e) => e.time).toString()}
          onBlur={onSetTime}
          onChange={(e) => setTimeValue(e.target.value)}
        />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
