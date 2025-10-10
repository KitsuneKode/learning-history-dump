import { createClient } from "redis";

const client = createClient();
client.connect();

let prices = {
    BTC: 2000,
};

let openOrders = [];
let balances = {
    user1: {
        usd: 1,
    },
};

client.on("connect", async () => {
    while (1) {
        let response = await client.xRead(
            {
                key: "trade-stream",
                id: "$",
            },
            {
                BLOCK: 100,
            },
        );
        console.log("reading");

        if (!response) {
            continue;
        }

        balances["user1"].usd -= 100;
        openOrders.push(response);

        const { name, messages } = response[0];
        const id = JSON.parse(messages[0].message.message).id;
        console.log("sent message back to callback qeueue");
        client.xAdd("callback-queue", "*", {
            id: id,
        });
    }
});
