import { z } from "zod";

export const User = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  name: z.string(),
  email: z.string(),
  dob: z.string(),
  favoriteColor: z.string(),
});

export type User = z.infer<typeof User>;

export const validateUserMeetsAgeRestriction = (user: User, today: Date) => {
  const dob = new Date(user.dob);
  const age = today.getFullYear() - dob.getFullYear();
  return age >= 18;
};
