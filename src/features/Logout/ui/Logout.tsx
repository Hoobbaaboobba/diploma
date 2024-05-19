"use client";

import { Button } from "@/shared/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useTransition } from "react";
import { logout } from "../../../../lib";
import { redirect } from "next/navigation";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface LogOutProps {
  session: any;
}

export default function Logout({ session }: LogOutProps) {
  const { mutate, pending } = useApiMutation(api.players.deletePlayer);

  async function logOut() {
    await mutate({
      playerId: session.user.id as Id<"Players">,
    });
    await logout();
    redirect("/");
  }

  return session ? (
    <Button
      onClick={logOut}
      className="absolute top-5 right-5"
      size="icon"
      variant="destructive"
    >
      {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  ) : null;
}
