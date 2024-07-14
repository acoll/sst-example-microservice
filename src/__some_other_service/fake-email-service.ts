import { EventBridgeHandler } from "aws-lambda";
import { UserEvent } from "~/integration-events/user.events";

/**
 * This is a fake email service to show how we might wire up an integration event
 * to send emails.
 */
export const handler: EventBridgeHandler<
  UserEvent["type"],
  UserEvent,
  void
> = async (event) => {
  switch (event.detail.type) {
    case "user.created":
      console.log("Send welcome email to", event.detail.data.email);
      break;
  }
};
