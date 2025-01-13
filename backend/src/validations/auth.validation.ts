import { z } from "zod";

const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
};

export { loginSchema };
