import { generateText, stepCountIs, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Define multiple functions
function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

function calculatePower(base, exponent) {
  return Math.pow(base, exponent);
}

// Define tools
const tools = {
  sum: tool({
    description: "Calculate the sum of two numbers",
    execute: async ({ a, b }) => {
      const result = calculateSum(a, b);
      console.log(`Sum: ${a} + ${b} = ${result}`);
      return result;
    },
    inputSchema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
  }),
  multiply: tool({
    description: "Calculate the product of two numbers",
    inputSchema: z.object({
      a: z.number().describe("First number"),
      b: z.number().describe("Second number"),
    }),
    execute: async ({ a, b }) => {
      const result = calculateProduct(a, b);
      console.log(`Product: ${a} × ${b} = ${result}`);
      return result;
    },
  }),

  power: tool({
    description: "Calculate base raised to the power of exponent",
    inputSchema: z.object({
      base: z.number().describe("Base number"),
      exponent: z.number().describe("Exponent"),
    }),
    execute: async ({ base, exponent }) => {
      const result = calculatePower(base, exponent);
      console.log(`Power: ${base}^${exponent} = ${result}`);
      return result;
    },
  }),
};

async function processQuery(query) {
  try {
    console.log(`\nProcessing: "${query}"\n`);

    const result = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: query,
      tools,
      stopWhen: stepCountIs(5),
    });

    console.log("\nFinal response:", result.text);

    if (result.toolCalls.length > 0) {
      console.log("\nTool calls made:");
      result.toolCalls.forEach((call, index) => {
        console.log(
          `${index + 1}. ${call.toolName}(${JSON.stringify(call.args)})`,
        );
      });
    }

    return result.text;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function main() {
  await processQuery(
    "First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2",
  );
}

main();
