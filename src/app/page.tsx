"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const [text, setText] = useState("");
  const createTodo = useMutation(api.todos.createTodo);
  const todos = useQuery(api.todos.getTodos);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {todos?.map((todo) => {
          return <div key={todo._id}>{todo.text}</div>;
        })}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            createTodo({
              text,
            });
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-black"
          />
          <button>Create</button>
        </form>
      </div>
    </main>
  );
}
