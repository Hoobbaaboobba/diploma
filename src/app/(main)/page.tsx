import { LoginForm } from "@/features/LoginForm";
import { CreateRoom } from "@/widgets/CreateRoom";
import { getSession } from "../../../lib";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      {JSON.stringify(session, null, 2)}
      <CreateRoom />
    </div>
  );
}
