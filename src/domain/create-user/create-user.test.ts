import assert from "assert";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { CreateUser, createUser } from "./create-user";

describe("create-user", () => {
  beforeEach(() => {
    // Set the system time to a fixed date
    vi.setSystemTime(new Date("2024-07-11"));
  });

  test("user age restriction violated", () => {
    const userCreatePayload: CreateUser = {
      name: "Adam Coll",
      email: "adamcoll.ac@gmail.com",
      dob: "2012-10-08",
      favoriteColor: "red",
    };

    const userId = "1";

    const result = createUser({ userId, data: userCreatePayload });
    expect(result.isErr()).toBe(true);
    assert(result.isErr());
    expect(result.error).toBe("USER_AGE_RESTRICTION_VIOLATED");
  });

  test("user created", () => {
    const userCreatePayload: CreateUser = {
      name: "Adam Coll",
      email: "adamcoll.ac@gmail.com",
      dob: "1987-10-08",
      favoriteColor: "red",
    };

    const userId = "1";

    const result = createUser({ userId, data: userCreatePayload });
    expect(result.isOk()).toBe(true);
  });
});
