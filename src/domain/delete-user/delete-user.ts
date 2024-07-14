import { ok } from "neverthrow";
import { User } from "../user";
import { UserOperation } from "../user-operation";

type DeletedUser = User & {
  deletedAt: string;
};

export const deleteUser: UserOperation<User, never> = (existingUser) => {
  const deletedUser: DeletedUser = {
    ...existingUser,
    deletedAt: new Date().toISOString(),
  };

  return ok({
    user: deletedUser,
    events: [
      {
        type: "user.deleted",
        data: { id: deletedUser.id, deletedAt: deletedUser.deletedAt },
      },
    ],
  });
};
