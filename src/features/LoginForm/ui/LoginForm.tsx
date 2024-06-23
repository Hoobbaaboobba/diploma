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

export default function LoginForm() {
  const { mutate, pending } = useApiMutation(api.users.createUser);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: userId,
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    return await login(values).then(() =>
      mutate({
        userId: values.id,
        name: values.name,
      })
    );
  }

  return (
    <div className="flex container justify-center items-center h-screen">
      <Card className="w-3/4">
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
                      <Input placeholder="Alex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {pending ? <Loader2 className="animate-spin" /> : "Enter"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
