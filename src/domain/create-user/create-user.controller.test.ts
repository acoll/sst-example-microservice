import assert from "assert";
import { ok } from "neverthrow";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { UserEventEmitter } from "../user.events";
import { UserRepository } from "../user.repository";
import { createCreateUserController } from "./create-user.controller";

const repo: UserRepository = {
  generateId: vi.fn(() => "USER_ID"),
  create: vi.fn((user) => Promise.resolve(ok(user))),
  getById: vi.fn(() => Promise.resolve(ok({} as any))),
  save: vi.fn(() => Promise.resolve(ok({} as any))),
};

const emit: UserEventEmitter = vi.fn();

const createUser = createCreateUserController(repo, emit);

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

    expect(repo.create).toHaveBeenCalledOnce();
    expect(emit).toHaveBeenCalledOnce();
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

    expect(repo.create).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });
});
