import { ICache } from "./ICache";

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<T> implements ICache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly ttl: number;
  private cleanupTimer: NodeJS.Timeout;

  constructor(ttl: number = 5000, cleanupInterval: number = 5000) {
    this.ttl = ttl;
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache) {
      if (item.expiresAt <= now) {
        this.cache.delete(key);
        console.log("key removed---->", key);
      }
    }
  }

  public destroy(): void {
    clearInterval(this.cleanupTimer);
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    //key does not exist
    if (!item) {
      return undefined;
    }

    // key has expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
  clear(): void {
    this.cache.clear();
  }
}
