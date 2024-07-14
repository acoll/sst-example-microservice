import assert from "assert";
import { ok } from "neverthrow";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { UserRepository } from "../user.repository";
import { createCreateUserController } from "./create-user.controller";

const repo: UserRepository = {
  generateId: vi.fn(() => "USER_ID"),
  getById: vi.fn(() => Promise.resolve(ok({} as any))),
  getByEmail: vi.fn((email) => {
    // Simple mock, if it includes the word existing then pretend we found a user
    return Promise.resolve(
      email.includes("existing") ? ok({} as any) : ok(null)
    );
  }),
  save: vi.fn(() => Promise.resolve(ok({} as any))),
};

const createUser = createCreateUserController(repo);

describe("create-user.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("user created | events emitted", async () => {
    const result = await createUser({
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "1990-01-01",
      favoriteColor: "blue",
    });

    expect(result.isOk()).toBe(true);
    assert(result.isOk()); // For type narrowing

    expect(repo.save).toHaveBeenCalledOnce();
  });

  test("user creation fails | existing user", async () => {
    const result = await createUser({
      name: "John Doe",
      email: "john.existing@example.com",
      dob: "1990-01-01",
      favoriteColor: "blue",
    });

    expect(result.isErr()).toBe(true);
    assert(result.isErr()); // For type narrowing

    expect(result.error).toBe("EMAIL_ALREADY_EXISTS");
    expect(repo.save).not.toHaveBeenCalled();
  });

  test("user creation fails | dob violation", async () => {
    const result = await createUser({
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "2024-01-01",
      favoriteColor: "blue",
    });

    expect(result.isErr()).toBe(true);

    assert(result.isErr()); // For type narrowing

    expect(repo.save).not.toHaveBeenCalled();
  });
});
