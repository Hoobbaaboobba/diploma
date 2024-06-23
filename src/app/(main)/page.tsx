import { LoginForm } from "@/features/LoginForm";
import { getSession } from "../../../lib";
import { CreateRoom } from "@/widgets/CreateRoom";

export default async function Home() {
  // берем сессию из lib.ts
  const session = await getSession();

  // если нет сессии, то предлагаем пользователю зарегистриваться
  if (!session) {
    return <LoginForm />;
  }

  // преобразуем полученную сессию в строку, в которой есть id и name пользвателя
  const jsonData = JSON.stringify(session, null, 2);

  // преобразуем строку с JSON object
  const sessionData = JSON.parse(jsonData);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <CreateRoom session={sessionData} />
    </div>
  );
}
