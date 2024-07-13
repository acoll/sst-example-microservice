import { UserEventEmitter } from "../user.events";
import { UserRepository } from "../user.repository";
import { deleteUser } from "./delete-user";

/**
 * A controller's responsibility is to orchestrate the use case and perform side effects
 */
export const createDeleteUserController = (
  repo: UserRepository,
  emit: UserEventEmitter
) => {
  return async (userId: string) => {
    const result = await repo.getById(userId);

    if (result.isErr()) {
      return result;
    }

    const existingUser = result.value;

    const deletedUser = deleteUser(existingUser);

    const saveResult = await repo.save(deletedUser.value);

    await emit({
      type: "user.deleted",
      data: {
        id: deletedUser.value.id,
        deletedAt: deletedUser.value.deletedAt,
      },
    });

    return saveResult;
  };
};
