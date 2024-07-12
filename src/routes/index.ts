import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { createLambdaHandler } from "@ts-rest/serverless/aws";
import { randomUUID } from "crypto";
import { Resource } from "sst";
import { User } from "~/domain/user";
import { contract } from "./contract";

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

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

      const user: User = {
        ...body,
        userId: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        name: "John Doe",
        email: `john.doe+${randomUUID()}@example.com`,
        dob: "1990-01-01",
        favoriteColor: "blue",
      };

      // Prepare the PutCommand with condition expression
      const command = new PutCommand({
        TableName: Resource.UsersTable.name,
        Item: user,
        ConditionExpression: "attribute_not_exists(email)", // Ensures email is unique
      });

      const result = await ddbDocClient.send(command);

      return {
        status: 201,
        body: user,
      };
    },
    readUser: async ({ params: { id } }) => {
      const command = new GetCommand({
        TableName: Resource.UsersTable.name,
        Key: {
          userId: id,
        },
      });
      const result = await ddbDocClient.send(command);
      const item = result.Item as User;

      if (!item) {
        return {
          status: 404,
          body: {
            message: "User not found",
          },
        };
      }

      return {
        status: 200,
        body: item as User,
      };
    },
    updateUser: async ({ params: { id }, body }) => {
      console.log({ id, body });

      const updateExpression = Object.keys(body)
        .map((key) => `${key} = :${key}`)
        .join(", ");
      const expressionAttributeValues = Object.entries(body).reduce(
        (acc, [key, value]) => {
          acc[`:${key}`] = value;
          return acc;
        },
        {} as { [key: string]: any }
      );

      const command = new UpdateCommand({
        TableName: Resource.UsersTable.name,
        Key: {
          userId: id,
        },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(userId)", // Ensure the user exists
        ReturnValues: "ALL_NEW",
      });
      const result = await ddbDocClient.send(command);
      const item = result.Attributes as User;

      return {
        status: 200 as const,
        body: item,
      };
    },
    deleteUser: async ({ params: { id } }) => {
      const command = new UpdateCommand({
        TableName: Resource.UsersTable.name,
        Key: {
          userId: id,
        },
        UpdateExpression: "set deletedAt = :deletedAt",
        ExpressionAttributeValues: {
          ":deletedAt": new Date().toISOString(),
        },
      });
      const result = await ddbDocClient.send(command);

      return {
        status: 200,
        body: null,
      };
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
