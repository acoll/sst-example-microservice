import { err, ok } from "neverthrow";
import { z } from "zod";
import { User, validateUserMeetsAgeRestriction } from "../user";
import { UserOperation } from "../user-operation";

export const UpdateUser = User.pick({
  name: true,
  dob: true,
  favoriteColor: true,
});
export type UpdateUser = z.infer<typeof UpdateUser>;

type UpdateUserError = {
  outcome: "USER_AGE_RESTRICTION_VIOLATED";
};

type UserUpdateParams = {
  existingUser: User;
  updates: UpdateUser;
};

export const updateUser: UserOperation<
  UserUpdateParams,
  "USER_AGE_RESTRICTION_VIOLATED"
> = ({ existingUser, updates }) => {
  const today = new Date();

  const updatedUser: User = {
    ...existingUser,
    ...updates,
    updatedAt: today.toISOString(),
  };

  // Arbitrary but I wanted an example of handling domain logic invariants
  if (!validateUserMeetsAgeRestriction(updatedUser, today)) {
    return err("USER_AGE_RESTRICTION_VIOLATED");
  }

  return ok({ user: updatedUser, events: [] });
};
