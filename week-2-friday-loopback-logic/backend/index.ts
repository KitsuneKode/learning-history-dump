import express from "express";
import { RedisSubscriber } from "./redisSubscriber";
import { createClient } from "redis";

const app = express();
const client = createClient();
client.connect();

app.use(express.json());
const redisSubscriber = new RedisSubscriber();

export const CREATE_ORDER_QUEUE = "trade-stream";

app.get("/trade/open", async (req, res) => {
    console.log("inside the route");
    const startTime = Date.now();
    const { asset, qty, type } = req.query;
    const id = Math.random().toString();

    console.log("sending message to the queue");
    await client.xAdd(CREATE_ORDER_QUEUE, "*", {
        message: JSON.stringify({
            kind: "create-order",
            asset,
            qty,
            type,
            id,
        }),
    });

    try {
        const responseFromEngine = await redisSubscriber.waitForMessage(id);

        res.json({
            message: "Order placed",
            time: Date.now() - startTime,
        });
    } catch (e) {
        res.status(411).json({
            message: "Trade not placed",
        });
    }
});

app.post("/trade/close", (req, res) => { });

console.log("hello there");
app.listen(3000);
