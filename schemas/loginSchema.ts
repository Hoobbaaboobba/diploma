import * as z from "zod";

export const loginSchema = z.object({
  id: z.string(),
  name: z.string(),
});
