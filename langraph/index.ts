import { createAgent, HumanMessage } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";

import { z } from "zod";
const responseFormat = z.object({
  response_from_agent: z.string(),
});
const sum = tool(
  async (input) => {
    console.log("sum tool called");
    return input.a + input.b;
  },
  {
    name: "sum",
    description: "Call to sum two numbers.",
    schema: z.object({
      a: z.number().describe("The first number to add."),
      b: z.number().describe("The second number to add."),
    }),
  },
);

const multiply = tool(
  async (input) => {
    console.log("multiply tool called");
    return input.a * input.b;
  },
  {
    name: "multiply",
    description: "Call to multiply two numbers.",
    schema: z.object({
      a: z.number().describe("The first number to multiply."),
      b: z.number().describe("The second number to multiply."),
    }),
  },
);

const exponent = tool(
  async (input) => {
    console.log("exponent tool called");
    return input.a ** input.b;
  },
  {
    name: "exponent",
    description: "Finds power of a number to a given number.",
    schema: z.object({
      a: z.number().describe("The number to find the power of."),
      b: z.number().describe("The power to raise the number to."),
    }),
  },
);

// Initialize the model with tools
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
});

const systemPrompt = `You are a helpful assistant. Your job is to help the user with their questions and tasks.

You have access to these tools 
: sum  -> sum of two numbers
: multiply -> multiply two numbers
: exponent -> exponent of two numbers


`;

const prompt = new HumanMessage(
  "First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2",
);

const agent = createAgent({
  model,
  tools: [exponent, sum, multiply],
  responseFormat,
  systemPrompt,
});
const response = await agent.invoke({
  messages: [prompt],
});

console.log(response.structuredResponse);
console.log(response.structuredResponse.response_from_agent);

console.log(response);
console.log("Tool called are");

response.messages.forEach((message) => {
  if (message.type === "tool" && message) console.log(message.name, "\n");
});
