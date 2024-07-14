import { z } from "zod";

const UserCreatedEvent = z.object({
  type: z.literal("user.created"),
  data: z.object({
    id: z.string(),
    createdAt: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});
type UserCreatedEvent = z.infer<typeof UserCreatedEvent>;

const UserDeletedEvent = z.object({
  type: z.literal("user.deleted"),
  data: z.object({ id: z.string(), deletedAt: z.string() }),
});
type UserDeletedEvent = z.infer<typeof UserDeletedEvent>;

export const UserEvent = z.discriminatedUnion("type", [
  UserCreatedEvent,
  UserDeletedEvent,
]);

export type UserEvent = z.infer<typeof UserEvent>;
