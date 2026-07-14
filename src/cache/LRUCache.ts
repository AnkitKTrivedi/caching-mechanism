import { ICache } from "./ICache";
import { LRUNode } from "./LRUNode";

export class LRUCache<T> implements ICache<T> {
  private capacity: number;
  private cache = new Map<string, LRUNode<T>>();
  private head: LRUNode<T>;
  private tail: LRUNode<T>;

  constructor(capacity: number) {
    this.capacity = capacity;

    this.head = new LRUNode("", {} as T);
    this.tail = new LRUNode("", {} as T);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private addNode(node: LRUNode<T>): void {
    node.prev = this.head;
    node.next = this.head.next;

    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<T>): void {
    const prev = node.prev;
    const next = node.next;

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }
  }

  private moveToFront(node: LRUNode<T>) {
    this.removeNode(node);
    this.addNode(node);
  }

  private removeTail(): LRUNode<T> {
    const node = this.tail.prev!;
    this.removeNode(node);
    return node;
  }

  get(key: string): T | undefined {
    const node = this.cache.get(key);
    // console.log("inside get node--->", node);
    if (!node) {
      return undefined;
    }
    // keep this as recently used
    this.moveToFront(node);
    return node?.value;
  }

  set(key: string, value: T): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return;
    }

    const node = new LRUNode(key, value);

    //console.log("node------>", node);

    this.cache.set(key, node);

    this.addNode(node);

    if (this.cache.size > this.capacity) {
      const removed = this.removeTail();
      this.cache.delete(removed.key);
    }
  }

  delete(key: string): void {
    const node = this.cache.get(key);
    if (!node) {
      return;
    }

    this.removeNode(node);
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
}
