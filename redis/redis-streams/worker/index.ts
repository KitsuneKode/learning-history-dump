import { RedisClient, sleep } from "bun";
import { createClient } from "redis";

const redis = await createClient()
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();

interface ResponseMessage {
  id: string;
  message: {
    demo: string;
    data: string;
  }[];
}
interface ResponseType {
  name: string;
  messages: ResponseMessage[];
}

async function main() {
  const streamName = "mystream";

  while (1) {
    const response = (await redis.xReadGroup(
      "mygroup",
      "myconsumer",
      { key: streamName, id: ">" },
      {
        COUNT: 1,
        BLOCK: 0,
      },
    )) as ResponseType[] | null;

    if (!response || response === null || response.length < 1) {
      console.log("empty");
      continue;
    }

    console.log(JSON.stringify(response[0]?.messages[0]?.message));
    const id = response[0]?.messages[0]?.id;
    await sleep(100);
    if (id) {
      await redis.xAck("mygroup", "mygroup", id);
      console.log("done");
    }
  }
}
main();
