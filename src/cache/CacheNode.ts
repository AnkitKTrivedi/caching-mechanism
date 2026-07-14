export class CacheNode<T> {
  constructor(
    public key: string,
    public value: T,
    public expiresAt: number,
  ) {
    this.expiresAt = expiresAt;
    this.key = key;
    this.value = value;
  }

  prev: CacheNode<T> | null = null;
  next: CacheNode<T> | null = null;
}
