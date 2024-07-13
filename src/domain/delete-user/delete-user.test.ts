import { beforeEach } from "node:test";
import { describe, expect, test, vi } from "vitest";
import { User } from "../user";
import { deleteUser } from "./delete-user";

describe("delete-user", () => {
  beforeEach(() => {
    // Set the system time to a fixed date
    vi.setSystemTime(new Date("2024-07-11"));
  });

  test("user deleted", () => {
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

    const result = deleteUser(existingUser);

    expect(result.isOk()).toBe(true);
    expect(result.value.deletedAt).toBeTruthy();
  });
});
