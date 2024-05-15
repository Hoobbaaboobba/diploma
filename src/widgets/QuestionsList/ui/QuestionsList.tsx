"use client";

import { Button } from "@/shared/ui/button";
import { v4 as uuidv4 } from "uuid";
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
import { useTransition } from "react";
import { loginSchema } from "../../../../schemas/loginSchema";
import { login } from "../../../../lib";

const userId = uuidv4();

export default function QuestionsList() {
  const [isPending, setTransition] = useTransition();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: userId,
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setTransition(async () => {
      await login(values);
    });
  }
  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Start</Button>
        </form>
      </Form>
    </section>
  );
}
