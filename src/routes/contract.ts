import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { CreateUser } from "~/domain/create-user/create-user";
import { UpdateUser } from "~/domain/update-user/update-user";
import { User } from "~/domain/user";

const c = initContract();

const ErrorMessage = z.object({ message: z.string() });

export const contract = c.router(
  {
    createUser: {
      method: "POST",
      path: "/user",
      body: CreateUser,
      responses: {
        201: User,
        400: ErrorMessage,
      },
      summary: "Create a user",
    },
    readUser: {
      method: "GET",
      path: `/user/:id`,
      responses: {
        200: User,
        404: ErrorMessage,
      },
      summary: "Read a user by id",
    },
    updateUser: {
      method: "PUT",
      path: `/user/:id`,
      body: UpdateUser,
      responses: {
        200: User,
        400: ErrorMessage,
        404: ErrorMessage,
      },
      summary: "Update a user",
    },
    deleteUser: {
      method: "DELETE",
      path: `/user/:id`,
      body: z.object({}),
      responses: { 200: z.null(), 404: ErrorMessage },
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
