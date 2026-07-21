import { SingleFlight } from "../concurrency/SinlgeFlight";
import { RedisCache } from "./RedisCache";
import { TTLCache } from "./TTLCache";

export class CacheManager<T> {
  private refreshRegistry = new Map<string, () => Promise<T | undefined>>();
  private refreshTimer: NodeJS.Timeout;
  private readonly singleFlight = new SingleFlight<T | undefined>();

  constructor(
    private readonly l1Cache: TTLCache<T>,
    private readonly l2Cache: RedisCache<T>,
  ) {
    this.refreshTimer = setInterval(() => {
      this.refreshAhead();
    }, 3000);
  }

  private async refreshAhead(): Promise<void> {
    const threshold = 5000;

    for (const [key, loader] of this.refreshRegistry) {
      try {
        const ttl = this.l1Cache.getRemainingTTL(key);

        if (ttl <= 0) {
          continue;
        }

        if (ttl > threshold) {
          continue;
        }

        console.log(`🔄 Refreshing ${key}`);

        const value = await this.singleFlight.execute(key, loader);

        if (value) {
          await this.set(key, value);
        }
      } catch (err) {
        console.error(`Refresh failed for ${key}`, err);
      }
    }
  }

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
    return undefined;
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

  public registerLoader(
    key: string,
    loader: () => Promise<T | undefined>,
  ): void {
    this.refreshRegistry.set(key, loader);
  }

  public deleteL1(key: string): void {
    this.l1Cache.delete(key);

    console.log(`🗑 L1 Cache Invalidated: ${key}`);
  }
}
