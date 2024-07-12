import { z } from "zod";

export const User = z.object({
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  dob: z.string(),
  favoriteColor: z.string(),
});

export type User = z.infer<typeof User>;
