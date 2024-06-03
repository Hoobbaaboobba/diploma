import QuestionsLayout from "@/widgets/QuestionsList/ui/QuestionsLayout";
import { getSession } from "../../../../lib";
import { redirect } from "next/navigation";

interface CreateRoomPageProps {
  params: {
    createId: string;
  };
}

export default async function CreateRoomPage({ params }: CreateRoomPageProps) {
  // берем сессию из lib.ts
  const session = await getSession();

  // если нет сессию, то перекидываем пользователя на главнную страницу
  if (!session) {
    return redirect("/");
  }

  // преобразуем полученную сессию в строку 
  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <QuestionsLayout params={params} session={sessionData} />;
}
