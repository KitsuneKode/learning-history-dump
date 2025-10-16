import { createClient } from "redis";
const redis = await createClient()
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();

async function main() {
  const streamName = "mystream";
  console.log("Type to send");
  for await (const line of console) {
    console.log(`You typed: ${line}`);
    const input = line;
    if (input) {
      const response = await redis.xAdd(streamName, "*", {
        demo: "trial",
        data: input,
      });

      console.log(response);
    }

    console.log("Type to send");
  }

  redis.destroy();
}

main();
