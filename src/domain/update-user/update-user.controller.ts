import { UserRepository } from "../user.repository";
import { UpdateUser, updateUser } from "./update-user";

/**
 * A controller's responsibility is to orchestrate the use case and perform side effects
 */
export const createUpdateUserController = (repo: UserRepository) => {
  return async (userId: string, payload: UpdateUser) => {
    const result = await repo.getById(userId);

    if (result.isErr()) {
      return result;
    }

    const existingUser = result.value;

    const updateResult = updateUser(existingUser, payload);

    if (updateResult.isErr()) {
      return updateResult;
    }

    const updatedUser = updateResult.value;

    const saveResult = await repo.save(updatedUser);

    return saveResult;
  };
};
