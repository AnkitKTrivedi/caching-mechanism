import { createClient } from "redis";
import { CacheManager } from "../cache/CacheManager";

export class CacheSubscriber<T> {
  private readonly subscriber = createClient({
    url: "redis://localhost:6379",
  });

  constructor(private readonly cacheManager: CacheManager<T>) {}

  async start(): Promise<void> {
    this.subscriber.on("error", console.error);

    await this.subscriber.connect();

    console.log("Subscriber Connected");

    await this.subscriber.subscribe("cache:invalidate", (key: string) => {
      console.log(`📨 Received invalidation: ${key}`);

      this.cacheManager.deleteL1(key);
    });
  }
}
