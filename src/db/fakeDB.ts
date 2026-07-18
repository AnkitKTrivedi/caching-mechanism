import { User } from "../interfaces/user.interface";

let users: User[] = [
  { id: 1, name: "John" },
  { id: 2, name: "Jonny" },
  { id: 3, name: "Jona" },
];

export const getUserFromDB = async (id: number): Promise<User | undefined> => {
  console.log("fetching user data from db....", id);
  return users.find((user) => user.id === id);
};

export const updateUser = async (
  id: number,
  user: User,
): Promise<User | undefined> => {
  let updateUser;
  users = users.map((item: User) => {
    if (id === item.id) {
      item.name = user.name;
      updateUser = item;
    }
    return item;
  });
  return updateUser;
};
