import { createClient } from "redis";

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

(async () => {
  await redisClient.connect();
})();
