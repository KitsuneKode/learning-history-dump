//anthropic api no money
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

(async () => {
  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 1024,
      tools: [
        {
          name: "get_weather",
          description: "Get the current weather in a given location",
          input_schema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
            },
            required: ["location"],
          },
        },
      ],
      messages: [
        {
          role: "user",
          content: "Tell me the weather in Chandigarh.",
        },
      ],
    });

    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
