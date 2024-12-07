import { z } from "zod";

const envSchema = z.object({
  MONGO_URI: z.string(),
  TOKEN_PRIVATE_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
