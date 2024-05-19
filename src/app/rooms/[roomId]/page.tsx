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
  const session = await getSession();

  const jsonData = JSON.stringify(session, null, 2);

  // Parse the JSON string into a JavaScript object
  const sessionData = JSON.parse(jsonData);

  if (!session) {
    return redirect("/");
  }

  redirect("/");

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Timer params={params} />
      <RoomQuestions params={params} session={sessionData} />
    </div>
  );
}
