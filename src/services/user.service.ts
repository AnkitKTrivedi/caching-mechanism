import { LRUCache } from "../cache/LRUCache";
import { LRUTTLCache } from "../cache/LRUTTLCache";
import { MemoryCache } from "../cache/memoryCache";
import { RedisCache } from "../cache/RedisCache";
import { TTLCache } from "../cache/TTLCache";
import { redisClient } from "../config/redis";
import { getUserFromDB, updateUser } from "../db/fakeDB";
import { User } from "../interfaces/user.interface";
import { RedisLock } from "../locks/RedisLock";
import { sleep } from "../utils/sleep";

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
const redisLock = new RedisLock(redisClient);

export const findUser = async (id: number): Promise<User | undefined> => {
  const cacheKey = `user:${id}`;

  console.log("-----------------------------------");
  console.log(`GET ${cacheKey}`);

  // 1. Check cache
  const cachedUser = await cache.get(cacheKey);

  if (cachedUser) {
    console.log("✅ Cache Hit");
    return cachedUser;
  }

  console.log("❌ Cache Miss");

  // 2. Check lock
  if (await redisLock.isLocked(cacheKey)) {
    console.log("🔒 Update in progress");
    console.log("⏳ Waiting...");

    await sleep(200);

    console.log("🔁 Retrying cache");

    const retry = await cache.get(cacheKey);

    if (retry) {
      console.log("✅ Cache Hit after retry");
      return retry;
    }

    console.log("⚠ Still missing after retry");
  }

  // 3. Database
  console.log("📀 Reading Database");

  const user = await getUserFromDB(id);

  if (user) {
    console.log("💾 Writing to cache");

    await cache.set(cacheKey, user);
  }

  return user;
};

export const updateUserData = async (
  id: number,
  user: User,
): Promise<User | undefined> => {
  const lockKey = `user:${id}`;
  const token = await redisLock.acquire(lockKey, 5000);

  if (!token) {
    throw new Error("Unable to accuire lock");
  }

  try {
    const userData = await updateUser(id, user);
    const key = id.toString();
    await cache.delete(key);
    return userData;
  } finally {
    await redisLock.release(lockKey, token);
  }
};
