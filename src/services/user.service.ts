import { LRUCache } from "../cache/LRUCache";
import { LRUTTLCache } from "../cache/LRUTTLCache";
import { MemoryCache } from "../cache/memoryCache";
import { RedisCache } from "../cache/RedisCache";
import { TTLCache } from "../cache/TTLCache";
import { getUserFromDB, updateUser } from "../db/fakeDB";
import { User } from "../interfaces/user.interface";

/** map caching from the local map */
// export const findUser = async (id: number): Promise<User | undefined> => {
//   if (cache.has(id)) {
//     console.log("return from cache");
//     return cache.get(id);
//   }
//   console.log("fetching from DB.....");
//   const user = await getUserFromDB(id);
//   if (user) {
//     cache.set(id, user);
//   }

//   return user;
// };

/** In memory caching from class */

// const cache = new MemoryCache<User>();

// export const findUser = async (id: number): Promise<User | undefined> => {
//   const key = id.toString();
//   const cachedUser = cache.get(key);

//   if (cachedUser) {
//     console.log("return from cache in memory cached class");
//     return cachedUser;
//   }

//   console.log("fetching from DB.....");
//   const user = await getUserFromDB(id);
//   if (user) {
//     cache.set(key, user);
//   }

//   return user;
// };

/** caching with TTL  */

// const cache = new TTLCache<User>(1000, 500);

// export const findUser = async (id: number): Promise<User | undefined> => {
//   const key = id.toString();
//   const cachedUser = cache.get(key);

//   if (cachedUser) {
//     console.log("return from cache in memory TTL cached class");
//     return cachedUser;
//   }

//   console.log("fetching from DB.....");
//   const user = await getUserFromDB(id);
//   if (user) {
//     cache.set(key, user);
//   }

//   return user;
// };

/** Implement with LRU cache */

// const cache = new LRUCache<User>(3);

// export const findUser = async (id: number): Promise<User | undefined> => {
//   const key = id.toString();
//   const cachedUser = cache.get(key);

//   if (cachedUser) {
//     console.log("return from cache in memory TTL cached class");
//     return cachedUser;
//   }

//   console.log("fetching from DB.....");
//   const user = await getUserFromDB(id);
//   if (user) {
//     cache.set(key, user);
//   }

//   return user;
// };

/** LRU + TTL implementation */

// const cache = new LRUTTLCache<User>(3);

// export const findUser = async (id: number): Promise<User | undefined> => {
//   const key = id.toString();
//   const cachedUser = cache.get(key);

//   if (cachedUser) {
//     console.log("return from cache in memory TTL cached class");
//     return cachedUser;
//   }

//   console.log("fetching from DB.....");
//   const user = await getUserFromDB(id);
//   if (user) {
//     cache.set(key, user);
//   }

//   return user;
// };

const cache = new RedisCache<User>();

export const findUser = async (id: number): Promise<User | undefined> => {
  const key = id.toString();
  const cachedUser = await cache.get(key);

  if (cachedUser) {
    console.log("return from cache in memory Redis cached class");
    return cachedUser;
  }

  console.log("fetching from DB.....");
  const user = await getUserFromDB(id);
  /** cache aside */
  if (user) {
    cache.set(key, user);
  }

  return user;
};

export const updateUserData = async (
  id: number,
  user: User,
): Promise<User | undefined> => {
  const userData = await updateUser(id, user);
  const key = id.toString();
  cache.delete(key);

  return userData;
};
