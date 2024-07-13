import { UserEventEmitter } from "../user.events";
import { UserRepository } from "../user.repository";
import { CreateUser, createUser } from "./create-user";

/**
 * A controller's responsibility is to orchestrate the use case and perform side effects
 */
export const createCreateUserController = (
  repo: UserRepository,
  emit: UserEventEmitter
) => {
  return async (payload: CreateUser) => {
    const createResult = createUser(repo.generateId(), payload);

    // Intentionally avoiding result.map and other result patterns
    // because it starts to look pretty opinionated

    if (createResult.isErr()) {
      return createResult;
    }

    const saveResult = await repo.create(createResult.value);

    if (saveResult.isErr()) {
      return saveResult;
    }

    const user = saveResult.value;

    await emit({
      type: "user.created",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: saveResult.value.createdAt,
      },
    });

    return createResult;
  };
};
