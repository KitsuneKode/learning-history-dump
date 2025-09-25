import {
  GenerateContentResponse,
  GoogleGenAI,
  Type,
  type Content,
} from "@google/genai";
import { executeSum, sum } from "./tools/sum";
import { weatherFunctionDeclaration } from "./tools/weather";
import { executeMultiply, multiply } from "./tools/multiply";
import { executeExponent, power } from "./tools/exponent";
// Configure the client
const ai = new GoogleGenAI({});

const input =
  "First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2";
const messageHistory: Content[] = [
  {
    role: "user",
    parts: [{ text: input }],
  },
];

// Send request with function declarations

// Check for function calls in the response

const processResponse = (response: GenerateContentResponse) => {
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCalls = response.functionCalls; // Assuming one function call
    console.log("Processing number of function calls ", functionCalls.length);
    const functionResponses = [];
    for (const call of functionCalls) {
      console.log(`Function to call: ${call.name}`);
      console.log(`Arguments: ${JSON.stringify(call.args)}`);
      let functionResult;
      switch (call.name) {
        case "get_sum": {
          const { a, b } = call.args;

          const sum = executeSum(a, b);

          console.log("sum", sum);
          functionResult = sum;

          break;
        }
        case "get_exponent": {
          const { a, b } = call.args;
          const power = executeExponent(a, b);

          console.log(`exponent of ${a} to the power of ${b}`, power);
          functionResult = power;
          break;
        }
        case "get_multiplication": {
          const { a, b } = call.args;
          const multiply = executeMultiply(a, b);

          console.log("multiply:", multiply);
          functionResult = multiply;
          break;
        }
        default: {
          console.log("no such tool");
          break;
        }
      }

      functionResponses.push({
        functionResponse: {
          name: call.name,
          response: { result: functionResult },
        },
      });
    }

    // const finalResponse = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: [
    //     { role: "user", parts: [{ text: input }] },
    //     response.candidates[0].content!,
    //
    //     { role: "user", parts: functionResponses },
    //   ],
    // });
    //
    // console.log("Response from llm", finalResponse.text);
    // In a real app, you would call your actual function here:

    return { moreToGen: true, functionResponses };
    // const result = await getCurrentTemperature(functionCall.args);
  } else {
    console.log(response.text, "No functions were called");
    return { moreToGen: false };
  }
};

while (1) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: messageHistory,
    config: {
      tools: [
        {
          functionDeclarations: [
            weatherFunctionDeclaration,
            sum,
            multiply,
            power,
          ],
        },
      ],
    },
  });

  const { moreToGen, functionResponses } = processResponse(response);
  if (moreToGen) {
    messageHistory.push(response.candidates[0].content);
    messageHistory.push({ role: "user", parts: functionResponses });
  } else {
    break;
  }
}
