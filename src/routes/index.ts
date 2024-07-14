import { generateOpenApi } from "@ts-rest/open-api";
import { createLambdaHandler } from "@ts-rest/serverless/aws";
import { Resource } from "sst";
import { createDdbUserRepository } from "~/database/ddb-user-repository";
import { createCreateUserController } from "~/domain/create-user/create-user.controller";
import { createDeleteUserController } from "~/domain/delete-user/delete-user.controller";
import { createUpdateUserController } from "~/domain/update-user/update-user.controller";
import { contract } from "./contract";

// Create the controller with implementations of repo and other dependencies.
const repo = createDdbUserRepository(Resource.Users.name, Resource.Events.name);

const createUser = createCreateUserController(repo);
const updateUser = createUpdateUserController(repo);
const deleteUser = createDeleteUserController(repo);

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Posts API",
    version: "1.0.0",
  },
});

/**
 * The route handler's responsibilities are:
 * 1. Validate the request body and params and translate them to the domain model
 *    This is done automatically by ts-rest contract schema
 * 2. Call the controller
 * 3. Translate the controller result to http responses
 *
 * The route handler should have no opinion of domain logic / business rules
 */
export const handler = createLambdaHandler(
  contract,
  {
    createUser: async ({ body }) => {
      const result = await createUser(body);

      if (result.isErr()) {
        switch (result.error) {
          case "EMAIL_ALREADY_EXISTS":
            return { status: 400, body: { message: "Email already exists" } };
          case "USER_AGE_RESTRICTION_VIOLATED":
            return {
              status: 400,
              body: { message: "User age restriction violated" },
            };
        }
      }

      return { status: 201, body: result.value };
    },
    readUser: async ({ params: { id } }) => {
      const result = await repo.getById(id);

      if (result.isErr()) {
        return { status: 404, body: { message: "User not found" } };
      }

      return { status: 200, body: result.value };
    },
    updateUser: async ({ params: { id }, body }) => {
      const result = await updateUser(id, body);

      if (result.isErr()) {
        switch (result.error) {
          case "USER_AGE_RESTRICTION_VIOLATED":
            return {
              status: 400,
              body: { message: "User age restriction violated" },
            };
          case "USER_NOT_FOUND":
            return { status: 404, body: { message: "User not found" } };
        }
      }

      return { status: 200, body: result.value };
    },
    deleteUser: async ({ params: { id } }) => {
      const result = await deleteUser(id);

      if (result.isErr()) {
        switch (result.error) {
          case "USER_NOT_FOUND":
            return { status: 404, body: { message: "User not found" } };
        }
      }

      return { status: 200, body: null };
    },
  },
  {
    // ensure responses adhere to defined schemas
    responseValidation: true,
    requestMiddleware: [
      (request) => {
        console.log(request.method, request.url);
      },
    ],
    responseHandlers: [
      async (response) => {
        console.log("Response:", response.status, await response.text());
      },
    ],
  }
);
