import { RedisCache } from "./RedisCache";

export class CacheManager<T> {
  constructor(private readonly cache: RedisCache<T>) {}

  public async writeThrough(key: string, value: T): Promise<void> {
    try {
      await this.cache.set(key, value);
    } catch (error) {
      console.log("error------->", error);
    }

    // retry
    // publish event
    // push deadletter
  }
}
