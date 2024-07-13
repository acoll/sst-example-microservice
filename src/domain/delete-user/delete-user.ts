import { Ok, ok } from "neverthrow";
import { User } from "../user";

type DeletedUser = User & {
  deletedAt: string;
};

export const deleteUser = (existingUser: User): Ok<DeletedUser, never> => {
  const deletedUser: DeletedUser = {
    ...existingUser,
    deletedAt: new Date().toISOString(),
  };

  return ok(deletedUser);
};
