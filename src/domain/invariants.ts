import { User } from "./user";

export const validateUserMeetsAgeRestriction = (user: User, today: Date) => {
  const dob = new Date(user.dob);
  const age = today.getFullYear() - dob.getFullYear();
  return age >= 18;
};
