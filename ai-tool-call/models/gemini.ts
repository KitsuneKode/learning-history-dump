import { GoogleGenAI, Type } from "@google/genai";
import { sum } from "./tools/sum";

// Configure the client
const ai = new GoogleGenAI({});

// Define the function declaration for the model
const weatherFunctionDeclaration = {
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

// Send request with function declarations
export const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "give me two numbers to doing addtion",
  config: {
    tools: [
      {
        functionDeclarations: [weatherFunctionDeclaration, sum],
      },
    ],
  },
});

// Check for function calls in the response
if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0]; // Assuming one function call
  console.log(`Function to call: ${functionCall.name}`);
  console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
  // In a real app, you would call your actual function here:
  // const result = await getCurrentTemperature(functionCall.args);
} else {
  console.log("No function call found in the response.");
  console.log(response.text);
}
