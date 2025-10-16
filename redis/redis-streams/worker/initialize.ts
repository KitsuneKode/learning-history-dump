import { createClient } from "redis";

const redis = await createClient()
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();
let seed = null;
try {
  seed = await redis.xGroupCreate("new", "mygroup", "$", {
    MKSTREAM: true,
  });
} catch (err: unknown) {
  console.error("seed failed");
  console.error((err as Error).message);
}
if (seed) {
  console.log("done", seed);
}

redis.quit();
