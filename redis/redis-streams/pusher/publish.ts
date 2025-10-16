import { createClient } from "redis";
import { RedisClient } from "bun";

const redis = await createClient()
  .on("error", (err) => console.error("Redis Client Error", err))
  .connect();

async function main() {
  const channelName = "mychannel";
  console.log("Type to publish");
  for await (const line of console) {
    console.log(`You typed: ${line}`);
    const input = line;
    if (input) {
      const response = await redis.publish(
        channelName,
        JSON.stringify({
          name: "John Die",
          data: input,
        }),
      );

      console.log(response);
    }

    console.log("Type to send");
  }

  redis.destroy();
}

main();

//complex(debug)

// import { createClient } from "redis";
//
// const redis = createClient({
//   url: "redis://localhost:6379",
//   socket: {
//     keepAlive: 100000, // 100s keepalive to prevent idle drops
//     reconnectStrategy: (retries) => {
//       if (retries > 10) return new Error('Max retries exceeded'); // Limit retries
//       return Math.min(1000 * Math.pow(2, retries), 5000); // Exponential backoff up to 5s
//     },
//   },
// });
//
// redis.on("error", (err) => console.error("Redis Error:", err));
// redis.on("connect", () => console.log("Publisher connected"));
// redis.on("ready", () => console.log("Publisher ready"));
// redis.on("end", () => console.log("Publisher disconnected"));
//
// await redis.connect();
//
// async function main() {
//   const channelName = "mychannel";
//   console.log("Type to publish (Ctrl+C to exit):");
//
//   for await (const line of console) {
//     const input = line.trim();
//     if (input.length > 0) {
//       console.log(`Publishing: ${input}`);
//       const payload = JSON.stringify({ name: "John Doe", data: input });
//       try {
//         const response = await redis.publish(channelName, payload);
//         console.log("Publish result:", response); // 1 if subscribers active
//         if (response === 0) console.warn("No subscribers—check subscriber script");
//       } catch (err) {
//         console.error("Publish failed:", err.message);
//       }
//     }
//   }
// }
//
// main().catch(console.error);
//
// process.on("SIGINT", async () => {
//   await redis.quit();
//   process.exit(0);
// });
//
