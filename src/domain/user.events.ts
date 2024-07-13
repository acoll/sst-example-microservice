type UserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
    createdAt: string;
    name: string;
    email: string;
  };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: { id: string; deletedAt: string };
};

export type UserEvent = UserCreatedEvent | UserDeletedEvent;
export type UserEventEmitter = (event: UserEvent) => Promise<void>;
