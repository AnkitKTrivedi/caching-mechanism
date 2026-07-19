/**
 * How would you prevent Cache Stampede in a Node.js application?
 * Within a single Node.js instance, I'd implement request coalescing (SingleFlight) by
 *  keeping a map of in-flight promises keyed by the cache key. Concurrent requests for
 *  the same missing key await the same promise, ensuring only one database query executes.
 *  In a distributed deployment with multiple instances, I'd combine this with a distributed
 *  lock (e.g., Redis SET NX PX) to coordinate across processes.
 */

export class SingleFlight<T> {
  private readonly inFlight = new Map<string, Promise<T>>();
  public async execute(key: string, loader: () => Promise<T>): Promise<T> {
    const existingPromise = this.inFlight.get(key);

    if (existingPromise) {
      console.log(`Joining existing request: ${key}`);
      return existingPromise;
    }

    console.log(`Creating new request: ${key}`);
    const promise = loader();
    this.inFlight.set(key, promise);
    try {
      return await promise;
    } finally {
      this.inFlight.delete(key);
    }
  }
}
