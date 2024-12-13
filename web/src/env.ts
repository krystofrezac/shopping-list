import { z } from "zod";

const schema = z.object({
  VITE_API_URL: z.string(),
  VITE_API_MOCK_ENABLED: z
    .string()
    .toLowerCase()
    .transform((x) => x === "true")
    .pipe(z.boolean()),
});

export const env = schema.parse(import.meta.env);
