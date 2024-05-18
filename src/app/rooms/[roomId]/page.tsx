import { LoginForm } from "@/features/LoginForm";
import { getSession } from "../../../../lib";
import { PlayersList } from "@/widgets/PlayersList";
import { LoginFormByLink } from "@/features/LoginFormByLink";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const session = await getSession();

  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  if (!session) {
    return <LoginFormByLink params={params} />;
  }

  return <PlayersList params={params} session={sessionData} />;
}
