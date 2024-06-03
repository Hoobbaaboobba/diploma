import { LoginForm } from "@/features/LoginForm";
import { getSession } from "../../../../lib";
import { PlayersList } from "@/widgets/PlayersList";
import { LoginFormByLink } from "@/features/LoginFormByLink";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function WaitingRoomPage({ params }: RoomPageProps) {
  // берем сессию из lib.ts
  const session = await getSession();

  // если нет сессии, то просим пользователя зарегистрироваться
  if (!session) {
    return <LoginFormByLink params={params} />;
  }

  // превращаем данные сессии в строку
  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <PlayersList params={params} session={sessionData} />;
}
