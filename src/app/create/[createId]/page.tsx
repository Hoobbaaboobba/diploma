import QuestionsLayout from "@/widgets/QuestionsList/ui/QuestionsLayout";
import { getSession } from "../../../../lib";

interface CreateRoomPageProps {
  params: {
    createId: string;
  };
}

export default async function CreateRoomPage({ params }: CreateRoomPageProps) {
  const session = await getSession();

  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <QuestionsLayout params={params} session={sessionData} />;
}
