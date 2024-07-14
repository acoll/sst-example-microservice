import { err, ok } from "neverthrow";
import { z } from "zod";
import { User, validateUserMeetsAgeRestriction } from "../user";
import { UserOperation } from "../user-operation";

export const CreateUser = User.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type CreateUser = z.infer<typeof CreateUser>;

type CreateUserParams = {
  userId: string;
  data: CreateUser;
};

export const createUser: UserOperation<
  CreateUserParams,
  "USER_AGE_RESTRICTION_VIOLATED"
> = ({ userId, data }) => {
  const today = new Date();

  const user: User = {
    id: userId,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    deletedAt: null,
    name: data.name,
    email: data.email,
    dob: data.dob,
    favoriteColor: data.favoriteColor,
  };

  // Arbitrary but I wanted an example of handling domain logic invariants
  if (!validateUserMeetsAgeRestriction(user, today)) {
    return err("USER_AGE_RESTRICTION_VIOLATED");
  }

  return ok({
    user,
    events: [
      {
        type: "user.created",
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
    ],
  });
};
