import { redis } from ".";

const seed = await redis.xGroupCreate("mystream", "mygroup", "$", {
  MKSTREAM: true,
});

console.log("done", seed);
