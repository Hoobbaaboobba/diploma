import { redirect } from "next/navigation";
import { getSession } from "../../../../lib";
import ResultsLayout from "@/widgets/Results/ui/ResultsLayout";

interface ResultsPageProps {
  params: {
    roomId: string;
  };
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  // получаем сессию из lib.ts
  const session = await getSession();

  // если нет сессии, то перекидываем пользователя на главную страницу
  if (!session) {
    return redirect(`/`);
  }

  // преобразуем в строку
  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  return <ResultsLayout session={sessionData} roomId={params.roomId} />;
}
