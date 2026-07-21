import { redisClient } from "../config/redis";

export class Publisher {
  async publishInvalidation(key: string): Promise<void> {
    await redisClient.publish("cache:invalidate", key);
    console.log(`published key ${key}`);
  }
}
