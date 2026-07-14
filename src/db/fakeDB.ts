import { User } from "../interfaces/user.interface";

const users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jonny" },
  { id: 3, name: "Jona" },
];

export const getUserFromDB = async (id: number): Promise<User | undefined> => {
  console.log("fetching user data from db....", id);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return users.find((user) => (user.id = id));
};
