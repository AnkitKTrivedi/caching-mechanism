import { RedisClientType } from "redis";

export class RedisLock {
  constructor(private readonly redis: RedisClientType) {}
  public async acquire(key: string, ttl: number): Promise<string | null> {
    const token = crypto.randomUUID();
    const result = await this.redis.set(`lock:${key}`, token, {
      NX: true,
      PX: ttl,
    });

    if (result === "OK") {
      return result;
    }

    return null;
  }

  public async release(key: string, token: string): Promise<boolean> {
    const result = await this.redis.eval(
      ` 
      if redis.call("GET", KEYS[1]) == ARGV[1]
        then
            return redis.call("DEL", KEYS[1])
      else
            return 0
        end`,
      {
        keys: [`lock:${key}`],
        arguments: [token],
      },
    );
    return result === 1;
  }

  public async isLocked(key: string): Promise<boolean> {
    const res = await this.redis.exists(`lock:${key}`);
    return res === 1;
  }
}
