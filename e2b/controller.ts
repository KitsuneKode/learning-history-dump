import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createFile, deleteFile, readFile, updateFile } from "./tools";
import { SYSTEM_PROMPT } from "./utils";
import type { Request, Response } from "express";
import { Sandbox } from "@e2b/code-interpreter";

const TEMPLATE_ID = "fiaaa2vk2eijixb5jct3";
export const promptController = async (req: Request, res: Response) => {
  const prompt = req.body.prompt;

  // Your template ID from the previous step
  // Pass the template ID to the `Sandbox.create` method
  const sandbox = await Sandbox.create(TEMPLATE_ID);
  const host = sandbox.getHost(5173);

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  const response = streamText({
    model: openrouter("gpt-4o-mini"),
    tools: {
      createFile: createFile(sandbox),
      updateFile: updateFile(sandbox),
      deleteFile: deleteFile(sandbox),
      readFile: readFile(sandbox),
    },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  res.json({
    url: `https://${host}`,
  });
  response.pipeTextStreamToResponse(res);
};
