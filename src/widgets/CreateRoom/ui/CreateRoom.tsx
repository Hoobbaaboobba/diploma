"use client";

import { Button } from "@/shared/ui/button";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";

const createId = uuidv4();

export default function CreateRoom() {
  const { mutate, pending } = useApiMutation(api.rooms.createRoom);
  const router = useRouter();

  const onClick = () => {
    router.push(`/create/${createId}`);
    return mutate({
      createId,
    });
  };
  return (
    <Button onClick={onClick} className="w-[200px]">
      {pending ? <Loader2 className="animate-spin" /> : "Make room"}
    </Button>
  );
}
