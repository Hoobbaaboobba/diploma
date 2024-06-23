"use client";

import { Button } from "@/shared/ui/button";
import { api } from "../../../../convex/_generated/api";
import { ProgressBar } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";

// типы пропсов
interface CreateRoomProps {
  session: any; // тип сессии
}

export default function CreateRoom({ session }: CreateRoomProps) {
  // кастомная функция создания комнаты
  const { mutate, pending } = useApiMutation(api.rooms.createRoom);

  // встроенная функция next js, которая позволяет взаимодействовать со страницей
  // https://nextjs.org/docs/app/api-reference/functions/use-router
  const router = useRouter();

  // если нет сессии, то ничего не возвращаем
  if (!session) {
    return null;
  }

  // создаем уникальный вспомогательный id с помощью библиотеки uuid
  const createId = uuidv4();

  // при нажатии на кнопку, создаем комнату
  const onClick = async () => {
    return await mutate({
      authorID: session.user.id,
      createId: createId,
    }).then(() => router.push(`/create/${createId}`)); // если нет ошибок, перекидываем пользователя на страницу создания с уникальным id в ссылке
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
