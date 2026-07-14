export class LRUNode<T> {
  key: string;
  value: T;
  prev: LRUNode<T> | null = null;
  next: LRUNode<T> | null = null;
  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
  }
}
