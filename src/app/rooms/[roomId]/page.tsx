import { RoomQuestions } from "@/widgets/RoomQuestions";
import Timer from "@/widgets/RoomQuestions/ui/Timer";
import { redirect } from "next/navigation";
import { getSession } from "../../../../lib";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  // берем сессию из lib.ts  
  const session = await getSession();

  // если нет сессии, то перекидывем пользователя на главную страницу
  if (!session) {
    return redirect("/");
  }

  // превращаем данные в строку
  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);


  return (
    <div className="w-full h-full flex justify-center items-center">
      <Timer params={params} session={sessionData} />
      <RoomQuestions params={params} session={sessionData} />
    </div>
  );
}
