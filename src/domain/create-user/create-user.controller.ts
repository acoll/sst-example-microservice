import { err } from "neverthrow";
import { UserRepository } from "../user.repository";
import { CreateUser, createUser } from "./create-user";

/**
 * A controller's responsibility is to orchestrate the use case and perform side effects
 */
export const createCreateUserController = (repo: UserRepository) => {
  return async (payload: CreateUser) => {
    const existing = await repo.getByEmail(payload.email);

    if (existing.isOk() && existing.value) {
      return err("EMAIL_ALREADY_EXISTS" as const);
    }

    const createResult = createUser({
      userId: repo.generateId(),
      data: payload,
    });

    // Intentionally avoiding result.map and other result patterns
    // because it starts to look pretty opinionated. It can result in
    // very clean code but I didn't want to include an extra layer to grok
    // for anyone reviewing.

    if (createResult.isErr()) {
      return createResult;
    }

    // The email uniqueness check could race condition. Discuss ways to properly enforce email uniqueness.
    const saveResult = await repo.save(createResult.value);

    if (saveResult.isErr()) {
      return saveResult;
    }

    return saveResult;
  };
};
