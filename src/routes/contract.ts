import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router(
  {
    createUser: {
      method: "POST",
      path: "/",
      body: z.object({}),
      responses: { 201: z.object({}) },
      summary: "Create a user",
    },
    readUser: {
      method: "GET",
      path: `/:id`,
      responses: {
        200: z.object({}),
        404: c.otherResponse({
          contentType: "text/plain",
          body: z.literal("User not found"),
        }),
      },
      summary: "Read a user by id",
    },
    updateUser: {
      method: "PATCH",
      path: `/:id`,
      body: z.object({}),
      responses: { 200: z.object({}) },
      summary: "Update a user",
    },
    deleteUser: {
      method: "DELETE",
      path: `/:id`,
      body: z.object({}),
      responses: { 200: z.object({}) },
      summary: "Delete a user",
    },
  },
  {
    // only allow the response status codes defined in the contract
    strictStatusCodes: true,
    // add common responses to the contract
    commonResponses: {
      500: c.otherResponse({
        contentType: "text/plain",
        body: z.literal("Server Error"),
      }),
    },
  }
);
