import { Result, err, ok } from "neverthrow";
import { z } from "zod";
import { User, validateUserMeetsAgeRestriction } from "../user";

export const UpdateUser = User.pick({
  name: true,
  dob: true,
  favoriteColor: true,
});
export type UpdateUser = z.infer<typeof UpdateUser>;

type UpdateUserError = {
  outcome: "USER_AGE_RESTRICTION_VIOLATED";
};

export const updateUser = (
  existingUser: User,
  updates: UpdateUser
): Result<User, UpdateUserError> => {
  const today = new Date();

  const updatedUser: User = {
    ...existingUser,
    ...updates,
    updatedAt: today.toISOString(),
  };

  // Arbitrary but I wanted an example of handling domain logic invariants
  if (!validateUserMeetsAgeRestriction(updatedUser, today)) {
    return err({
      outcome: "USER_AGE_RESTRICTION_VIOLATED",
      error: "User must be at least 18 years old",
    });
  }

  return ok(updatedUser);
};
