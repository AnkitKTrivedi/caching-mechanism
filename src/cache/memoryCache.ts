import { ICache } from "./ICache";

const cache = new Map();

export class MemoryCache<T> implements ICache<T> {
  private cache = new Map<string, T>();
  async get(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async set(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
  async clear(): Promise<void> {
    this.cache.clear();
  }
}

export default cache;
