import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStreamHandler } from "aws-lambda";
import { Resource } from "sst";
import { UserEvent } from "./user.events";

const eventBridgeClient = new EventBridgeClient();

/**
 * Integration events are stored to a dynamo db table when entities are saved using a simple
 * version of an outbox pattern. This lambda function reads from the dynamo db table and sends
 * the events to eventbridge so other services can subscribe to them.
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    if (record.dynamodb?.NewImage) {
      const unmarshalled = unmarshall(
        record.dynamodb.NewImage as { [key: string]: AttributeValue }
      );
      const event = UserEvent.parse(unmarshalled.event);
      await sendEvent(event);
    }
  }
};

const sendEvent = async (event: UserEvent) => {
  const command = new PutEventsCommand({
    Entries: [
      {
        Source: "sst-example-microservice",
        DetailType: event.type,
        Detail: JSON.stringify(event),
        EventBusName: Resource.Bus.name,
      },
    ],
  });

  try {
    const result = await eventBridgeClient.send(command);
    console.log("Event sent to EventBridge:", result);
  } catch (error) {
    console.error("Error sending event to EventBridge:", error);
  }
};
