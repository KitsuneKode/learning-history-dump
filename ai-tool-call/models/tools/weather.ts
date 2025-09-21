import { Type, type FunctionDeclaration } from "@google/genai";

// Define the function declaration for the model
export const weatherFunctionDeclaration: FunctionDeclaration = {
  name: "get_current_temperature",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city name, e.g. Chandigarh",
      },
    },
    required: ["location"],
  },
};
