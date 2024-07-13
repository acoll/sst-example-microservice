import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { err, ok } from "neverthrow";
import { User } from "~/domain/user";
import { UserRepository } from "~/domain/user.repository";

export const createDdbUserRepository = (tableName: string): UserRepository => {
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
    create: async (user: User) => {
      const command = new PutCommand({
        TableName: tableName,
        Item: user,
        ConditionExpression: "attribute_not_exists(email)", // Ensures email is unique
      });

      try {
        await send(command);
        return ok(user);
      } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
          return err({ outcome: "EMAIL_ALREADY_EXISTS", email: user.email });
        }

        // Other error is treated as uncaught
        throw error;
      }
    },
    getById: async (id: string) => {
      const command = new GetCommand({
        TableName: tableName,
        Key: { id },
      });

      const result = await send(command);

      if (!result.Item) {
        return err({ outcome: "USER_NOT_FOUND" });
      }

      const user = User.parse(result.Item);

      if (user.deletedAt) {
        return err({ outcome: "USER_NOT_FOUND" });
      }

      return ok(user);
    },
    save: async (user: User) => {
      const command = new PutCommand({
        TableName: tableName,
        Item: user,
        ConditionExpression: "attribute_exists(id)", // Ensure the user exists
      });

      try {
        await send(command);
        return ok(user);
      } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
          return err({ outcome: "USER_NOT_FOUND" });
        }

        throw error;
      }
    },
  };
};
