import { describe, expect, test } from "vitest";
import { User, validateUserMeetsAgeRestriction } from "./user";

describe("user", () => {
  test("validateUserMeetsAgeRestriction", () => {
    const validUser: User = {
      id: "1",
      createdAt: "2024-07-11",
      updatedAt: "2024-07-11",
      deletedAt: null,
      name: "Adam Coll",
      email: "adamcoll.ac@gmail.com",
      dob: "1987-10-08",
      favoriteColor: "purple",
    };

    const invalidUser: User = {
      id: "1",
      createdAt: "2024-07-11",
      updatedAt: "2024-07-11",
      deletedAt: null,
      name: "Young User",
      email: "younguser@gmail.com",
      dob: "2007-10-08",
      favoriteColor: "blue",
    };

    const today = new Date("2024-07-11");

    expect(validateUserMeetsAgeRestriction(validUser, today)).toBe(true);
    expect(validateUserMeetsAgeRestriction(invalidUser, today)).toBe(false);
  });
});
