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
import { Check } from "lucide-react";

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
      <CardContent className="relative">
        <Input
          defaultValue={getRoom?.map((e) => e.time).toString()}
          onBlur={onSetTime}
          onChange={(e) => setTimeValue(e.target.value)}
          className={`${timeValue.length > 0 && "border-emerald-400"}`}
        />
        {timeValue.length > 0 && (
          <div className="absolute text-sm flex justify-center items-center top-3 right-8">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
