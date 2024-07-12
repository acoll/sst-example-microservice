import { createLambdaHandler } from "@ts-rest/serverless/aws";
import { contract } from "./contract";

/**
 * The route handler's responsibilities are:
 * 1. Validate the request body and params and translate them to the domain model
 * 2. Call the controller
 * 3. Translate the controller result to http responses
 *
 * The route handler should have no opinion of domain logic / business rules
 */

export const handler = createLambdaHandler(
  contract,
  {
    createUser: async ({ body }) => {
      console.log("Create User", body);
      throw new Error("Not implemented");
    },
    readUser: async ({ params: { id } }) => {
      console.log("Read User", id);
      throw new Error("Not implemented");
    },
    updateUser: async ({ params: { id }, body }) => {
      console.log("Update User", id, body);
      throw new Error("Not implemented");
    },
    deleteUser: async ({ params: { id } }) => {
      console.log("Delete User", id);
      throw new Error("Not implemented");
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
      async (response, request, { rawEvent, lambdaContext }) => {
        console.log("Response:", response.status, await response.text());
      },
    ],
  }
);
