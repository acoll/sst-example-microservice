type UserCreatedEvent = {
  type: "user.created";
  data: {
    userId: string;
    createdAt: string;
    name: string;
    email: string;
  };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: {
    userId: string;
    deletedAt: string;
  };
};

export type UserEvent = UserCreatedEvent | UserDeletedEvent;
