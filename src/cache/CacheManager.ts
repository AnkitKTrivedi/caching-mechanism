import { RedisCache } from "./RedisCache";
import { TTLCache } from "./TTLCache";

export class CacheManager<T> {
  constructor(
    private readonly l1Cache: TTLCache<T>,
    private readonly l2Cache: RedisCache<T>,
  ) {}

  public async get(key: string): Promise<T | undefined> {
    const l1Value = this.l1Cache.get(key);

    if (l1Value) {
      console.log("L1 Cache Hit");

      return l1Value;
    }

    const l2Value = await this.l2Cache.get(key);

    if (l2Value) {
      console.log("L2 Cache Hit");

      this.l1Cache.set(key, l2Value);

      return l2Value;
    }
  }

  public async set(key: string, value: T): Promise<void> {
    this.l1Cache.set(key, value);

    await this.l2Cache.set(key, value);
  }

  public async delete(key: string): Promise<void> {
    this.l1Cache.delete(key);

    await this.l2Cache.delete(key);
  }
  public async clear(): Promise<void> {
    await this.l1Cache.clear();

    await this.l2Cache.clear();
  }
}
