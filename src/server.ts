import app from "./app";
import { User } from "./interfaces/user.interface";
import { CacheSubscriber } from "./redis/subscriber";
import { cacheManager } from "./services/user.service";

const PORT = 6000;

async function bootstrap() {
  const subscriber = new CacheSubscriber<User>(cacheManager);

  await subscriber.start();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
