import * as z from "zod";

// валидации входа
export const loginSchema = z.object({
  id: z.string(), // id пользователя
  name: z.string(), // имя пользователя
});
