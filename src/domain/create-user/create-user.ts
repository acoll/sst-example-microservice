import { Result, err, ok } from "neverthrow";
import { z } from "zod";
import { User, validateUserMeetsAgeRestriction } from "../user";

export const CreateUser = User.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type CreateUser = z.infer<typeof CreateUser>;

type CreateUserError = {
  outcome: "USER_AGE_RESTRICTION_VIOLATED";
};

export const createUser = (
  userId: string,
  userCreatePayload: CreateUser
): Result<User, CreateUserError> => {
  const today = new Date();

  const user: User = {
    id: userId,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    deletedAt: null,
    name: userCreatePayload.name,
    email: userCreatePayload.email,
    dob: userCreatePayload.dob,
    favoriteColor: userCreatePayload.favoriteColor,
  };

  // Arbitrary but I wanted an example of handling domain logic invariants
  if (!validateUserMeetsAgeRestriction(user, today)) {
    return err({
      outcome: "USER_AGE_RESTRICTION_VIOLATED",
      error: "User must be at least 18 years old",
    });
  }

  return ok(user);
};
