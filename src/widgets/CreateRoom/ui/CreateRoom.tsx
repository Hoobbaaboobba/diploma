"use client";

import { Button } from "@/shared/ui/button";
import { api } from "../../../../convex/_generated/api";
import { Loader2 } from "lucide-react";

import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";

interface CreateRoomProps {
  session: any;
}

export default function CreateRoom({ session }: CreateRoomProps) {
  const { mutate, pending } = useApiMutation(api.rooms.createRoom);
  const router = useRouter();

  if (!session) {
    return null;
  }

  const createId = uuidv4();

  const onClick = async () => {
    return await mutate({
      authorID: session.user.id,
      createId: createId,
    }).then(() => router.push(`/create/${createId}`));
  };
  return (
    <Button onClick={onClick} className="w-[200px] mt-[400px]">
      {pending ? <Loader2 className="animate-spin" /> : "Make room"}
    </Button>
  );
}
