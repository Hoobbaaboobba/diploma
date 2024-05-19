"use client";

import { Button } from "@/shared/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { useTransition } from "react";
import { logout } from "../../../../lib";
import { redirect } from "next/navigation";

interface LogOutProps {
  session: any;
}

export default function Logout({ session }: LogOutProps) {
  const [isPending, startTransition] = useTransition();

  function logOut() {
    startTransition(async () => {
      await logout();
      redirect("/");
    });
  }

  return session ? (
    <Button
      onClick={logOut}
      className="absolute top-5 right-5"
      size="icon"
      variant="destructive"
    >
      {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
    </Button>
  ) : null;
}
