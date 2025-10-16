import { sleep } from "bun";
import { createClient } from "redis";

const redis = await createClient()
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();

const sub = redis.duplicate();

await sub
  .on("error", (err) => console.error("Subscribe Client Error", err))
  .connect();

async function main() {
  const channelName = "mychannel";

  await sub.subscribe(channelName, async (msg) => {
    console.log(JSON.parse(msg));
    await sleep(100);
    const response = await redis.xAdd("mystream", "*", {
      demo: "subscriber",
      data: "got a message",
    });
    if (response) {
      console.log(response);
    } else {
      console.error("not sent");
    }
  });
}
main();
