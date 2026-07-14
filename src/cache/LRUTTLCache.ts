import { CacheNode } from "./CacheNode";
import { ICache } from "./ICache";

export class LRUTTLCache<T> implements ICache<T> {
  private capacity: number;
  private readonly ttl: number;
  private cleanupTimer: NodeJS.Timeout;
  private cache = new Map<string, CacheNode<T>>();
  private head: CacheNode<T>;
  private tail: CacheNode<T>;

  constructor(
    capacity: number,
    ttl: number = 5000,
    cleanupInterval: number = 5000,
  ) {
    if (capacity <= 0) {
      throw new Error("Capacity must be greater than zero.");
    }
    this.capacity = capacity;
    this.ttl = ttl;
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, cleanupInterval);

    this.head = new CacheNode("", {} as T, Number.MAX_SAFE_INTEGER);
    this.tail = new CacheNode("", {} as T, Number.MAX_SAFE_INTEGER);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private addNode(node: CacheNode<T>): void {
    node.prev = this.head;
    node.next = this.head.next;

    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: CacheNode<T>): void {
    const prev = node.prev;
    const next = node.next;

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }
  }

  private moveToFront(node: CacheNode<T>) {
    this.removeNode(node);
    this.addNode(node);
  }

  private removeTail(): CacheNode<T> {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      return undefined;
    }

    if (Date.now() >= item.expiresAt) {
      this.removeNode(item);
      this.cache.delete(key);
      return undefined;
    }

    this.moveToFront(item);
    return item.value;
  }

  set(key: string, value: T): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      existing.expiresAt = Date.now() + this.ttl;
      this.moveToFront(existing);
      return;
    }

    const node = new CacheNode(key, value, Date.now() + this.ttl);

    //console.log("node------>", node);

    this.cache.set(key, node);

    this.addNode(node);

    if (this.cache.size > this.capacity) {
      const removed = this.removeTail();
      this.cache.delete(removed.key);
    }
  }

  delete(key: string): void {
    const item = this.cache.get(key);
    if (!item) return;
    this.removeNode(item);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache) {
      if (item.expiresAt <= now) {
        this.cache.delete(key);
        this.removeNode(item);
        console.log("key removed---->", key);
      }
    }
  }

  public destroy(): void {
    clearInterval(this.cleanupTimer);
  }
}
