import { expect, test } from "vitest";
import { CreateUser, createUser } from "./create-user";
import assert from "assert";

test("createUser: user age restriction violated", () => {
  const userCreatePayload: CreateUser = {
    id: "1",
    name: "Adam Coll",
    email: "adamcoll.ac@gmail.com",
    dob: "1987-10-08",
    favoriteColor: "red",
  };

  const today = new Date("2024-07-11");

  const result = createUser(userCreatePayload, today);
  expect(result.outcome).toBe("USER_CREATED");
  assert(result.outcome === 'USER_CREATED');
  expect(result.payload.events)
});
