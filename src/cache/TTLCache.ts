export interface IAsyncCache<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<T> implements IAsyncCache<T> {
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

  async get(key: string): Promise<T | undefined> {
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

  async set(key: string, value: T): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  public getRemainingTTL(key: string): number {
    const item = this.cache.get(key);

    if (!item) {
      return -1;
    }

    return item.expiresAt - Date.now();
  }
}
