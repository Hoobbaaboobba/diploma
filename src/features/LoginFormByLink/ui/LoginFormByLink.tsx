"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { loginSchema } from "../../../../schemas/loginSchema";
import { login } from "../../../../lib";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import { v4 as uuidv4 } from "uuid";
import { useApiMutation } from "@/entities/mutation/use-api-mutation";
import { api } from "../../../../convex/_generated/api";

const userId = uuidv4();

interface LoginFormByLinkProps {
  params: {
    roomId: string;
  };
}

export default function LoginFormByLink({ params }: LoginFormByLinkProps) {
  const { mutate: createUser } = useApiMutation(api.users.createUser);

  const { mutate: createPlayer, pending: createPlayerPending } = useApiMutation(
    api.players.create
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: userId,
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    return await login(values)
      .then(() =>
        createUser({
          userId: values.id,
          name: values.name,
        })
      )
      .then(() =>
        createPlayer({
          name: values.name,
          playerId: values.id,
          roomId: params.roomId,
          role: "quest",
          isReady: false,
          isAnswered: false,
        })
      );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>Enter your name</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {createPlayerPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Enter"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
