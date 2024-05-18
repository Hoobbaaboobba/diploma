import QuestionsLayout from "@/widgets/QuestionsList/ui/QuestionsLayout";
import { redirect } from "next/navigation";
import { getSession } from "../../../../lib";

interface CreateRoomPageProps {
  params: {
    createId: string;
  };
}

export default async function CreateRoomPage({ params }: CreateRoomPageProps) {
  const session = await getSession();

  if (!session) {
    return redirect("/");
  }

  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <QuestionsLayout params={params} session={sessionData} />;
}
