import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { err, ok } from "neverthrow";
import { User } from "~/domain/user";
import { UserRepository } from "~/domain/user.repository";
import { UserEvent } from "~/integration-events/user.events";

export const createDdbUserRepository = (
  entityTable: string,
  eventTableName: string
): UserRepository => {
  const ddbClient = new DynamoDBClient();
  const client = DynamoDBDocumentClient.from(ddbClient);

  const send: typeof client.send = async (command) => {
    console.log("[DDB Repo] Command:", command.input);
    const result = await client.send(command);
    console.log("[DDB Repo] Result:", result);
    return result;
  };

  return {
    generateId: () => {
      return randomUUID();
    },
    getById: async (id: string) => {
      const command = new GetCommand({
        TableName: entityTable,
        Key: { id },
      });

      const result = await send(command);

      if (!result.Item) {
        return err("USER_NOT_FOUND");
      }

      const user = User.parse(result.Item);

      if (user.deletedAt) {
        return err("USER_NOT_FOUND");
      }

      return ok(user);
    },
    getByEmail: async (email: string) => {
      const command = new QueryCommand({
        TableName: entityTable,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      });

      const result = await send(command);
      const first = result.Items?.[0];

      if (!first) {
        return ok(null);
      }

      const user = User.parse(first);

      return ok(user);
    },
    save: async ({ user, events }: { user: User; events: UserEvent[] }) => {
      const userCommand = {
        Put: {
          TableName: entityTable,
          Item: user,
        },
      };

      const eventCommands = events.map((event) => ({
        Put: {
          TableName: eventTableName,
          Item: {
            id: randomUUID(),
            createdAt: new Date().toISOString(),
            event,
          },
        },
      }));

      const transactCommand = new TransactWriteCommand({
        TransactItems: [userCommand, ...eventCommands],
      });

      try {
        await send(transactCommand);
        return ok(user);
      } catch (error) {
        console.log("ERRRRRRR****************");
        console.log(error);

        throw error;
      }
    },
  };
};
