import type { RedisClient } from "bun";
import { createClient, type RedisClientType } from "redis";

export const CALLBACK_QUEUE = "callback-queue";
export class RedisSubscriber {
    private client: RedisClientType;
    private callbacks: Record<string, () => void>;

    constructor() {
        this.client = createClient();
        this.client.connect();
        this.runLoop();
        this.callbacks = {};
    }

    async runLoop() {
        while (1) {
            const response = await this.client.xRead(
                {
                    key: CALLBACK_QUEUE,
                    id: "$",
                },
                {
                    COUNT: 1,
                    BLOCK: 100,
                },
            );
            console.log("hi there");

            if (!response) {
                continue;
            }

            const { name, messages } = response[0];
            console.log(messages[0].message.id);
            console.log("received message from the callback queue/engine");
            this.callbacks[messages[0].message.id]();
            delete this.callbacks[messages[0].message.id];
        }
    }

    // throw an error (reject) if u dont get back a message in 5s
    waitForMessage(callbackId: string) {
        return new Promise((resolve, reject) => {
            this.callbacks[callbackId] = resolve;
            setTimeout(() => {
                if (this.callbacks[callbackId]) {
                    reject();
                }
            }, 5000);
        });
    }
}
