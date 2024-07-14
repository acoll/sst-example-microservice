import { Result } from "neverthrow";
import { UserEvent } from "../integration-events/user.events";
import { User } from "./user";

/**
 * A user operation is a function that performs a user operation and returns a result.
 * The result is an object of the user and the events that occurred during the operation.
 * The events are integration events that should be published to the event bus.
 *
 * Events should be saved to an outbox table in the same transaction as saving the entity.
 */
export type UserOperation<Params, E extends string> = (
  params: Params
) => Result<{ user: User; events: UserEvent[] }, E>;
