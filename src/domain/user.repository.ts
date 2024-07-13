import { Result } from "neverthrow";
import { User } from "./user";

type EmailAlreadyExistsError = {
  outcome: "EMAIL_ALREADY_EXISTS";
  email: string;
};
type NotFoundError = { outcome: "USER_NOT_FOUND" };

export type UserRepository = {
  generateId: () => string;
  create: (user: User) => Promise<Result<User, EmailAlreadyExistsError>>;
  save: (user: User) => Promise<Result<User, NotFoundError>>;
  getById: (id: string) => Promise<Result<User, NotFoundError>>;
};
