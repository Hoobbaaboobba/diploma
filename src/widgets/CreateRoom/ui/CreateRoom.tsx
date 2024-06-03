"use client";

import { Button } from "@/shared/ui/button";
import { api } from "../../../../convex/_generated/api";
import { ProgressBar } from "react-loader-spinner";
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
    <Button
      disabled={pending}
      onClick={onClick}
      size="lg"
      className="w-[250px] mt-[400px]"
    >
      {pending ? (
        <>
          Creating room
          <ProgressBar
            visible={true}
            height="50"
            width="50"
            barColor="#fff"
            borderColor="#fff"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="ml-2"
          />
        </>
      ) : (
        "Make room"
      )}
    </Button>
  );
}
