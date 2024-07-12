import { z } from "zod";
import { UserEvent } from "./events";
import { validateUserMeetsAgeRestriction } from "./invariants";
import { User } from "./user";

export const CreateUser = User.omit({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type CreateUser = z.infer<typeof CreateUser>;

export type CreateUserResult =
  | {
      outcome: "USER_CREATED";
      payload: { user: User; events: UserEvent[] };
    }
  | {
      outcome: "USER_AGE_RESTRICTION_VIOLATED";
      payload: { error: string };
    };

export const createUser = (
  userCreatePayload: CreateUser,
  today: Date
): CreateUserResult => {
  const user: User = {
    id: userCreatePayload.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
    name: userCreatePayload.name,
    email: userCreatePayload.email,
    dob: userCreatePayload.dob,
    favoriteColor: userCreatePayload.favoriteColor,
  };

  if (!validateUserMeetsAgeRestriction(user, today)) {
    return {
      outcome: "USER_AGE_RESTRICTION_VIOLATED",
      payload: { error: "User must be at least 18 years old" },
    };
  }

  return {
    outcome: "USER_CREATED",
    payload: {
      user: user,
      events: [
        {
          type: "user.created",
          data: {
            userId: user.id,
            createdAt: user.createdAt,
            name: user.name,
            email: user.email,
          },
        },
      ],
    },
  };
};
