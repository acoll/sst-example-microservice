import { Result } from "neverthrow";
import { UserEvent } from "../integration-events/user.events";
import { User } from "./user";

export type UserRepository = {
  generateId: () => string;
  save: (opts: {
    user: User;
    events: UserEvent[];
  }) => Promise<Result<User, never>>;
  getById: (id: string) => Promise<Result<User, "USER_NOT_FOUND">>;
  getByEmail: (email: string) => Promise<Result<User | null, never>>;
};
