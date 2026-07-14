import { redisClient } from "../config/redis";
import { ICache } from "./ICache";

export class RedisCache<T> implements ICache<T> {
  async get(key: string): Promise<T | undefined> {
    const value = await redisClient.get(key);

    if (!value) {
      return undefined;
    }

    return JSON.parse(value) as T;
  }

  async set(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl) {
      await redisClient.set(key, JSON.stringify(value), {
        PX: ttl,
      });
    } else {
      await redisClient.set(key, JSON.stringify(value));
    }
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async clear(): Promise<void> {
    redisClient.flushDb();
  }
}
