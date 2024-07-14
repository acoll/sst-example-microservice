import assert from "assert";
import { beforeEach } from "node:test";
import { describe, expect, test, vi } from "vitest";
import { User } from "../user";
import { UpdateUser, updateUser } from "./update-user";

describe("update-user", () => {
  beforeEach(() => {
    // Set the system time to a fixed date
    vi.setSystemTime(new Date("2024-07-11"));
  });

  test("user age restriction violated", () => {
    const existingUser: User = {
      id: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "1987-10-08",
      favoriteColor: "red",
    };

    const updates: UpdateUser = {
      name: "John Doe",
      dob: "2012-01-01",
      favoriteColor: "red",
    };

    const result = updateUser({ existingUser, updates });

    expect(result.isErr()).toBe(true);
    assert(result.isErr());
    expect(result.error).toBe("USER_AGE_RESTRICTION_VIOLATED");
  });

  test("user updated", () => {
    const existingUser: User = {
      id: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      name: "John Doe",
      email: "john.doe@example.com",
      dob: "1987-10-08",
      favoriteColor: "red",
    };

    const updates: UpdateUser = {
      name: "John Doe",
      dob: "1987-01-01",
      favoriteColor: "red",
    };

    const result = updateUser({ existingUser, updates });

    expect(result.isOk()).toBe(true);
  });
});
