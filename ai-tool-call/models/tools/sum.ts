import { Type, type FunctionDeclaration } from "@google/genai";
export const sum: FunctionDeclaration = {
  name: "get_sum",
  description: "Calculates the sum of two numbers. ",
  parametersJsonSchema: {
    type: "OBJECT",
    properties: {
      a: {
        type: Type.NUMBER,
      },
      b: {
        type: Type.NUMBER,
      },
    },
    required: ["a", "b"],
  },
};

export const executeSum = (a: number, b: number): number => {
  return a + b;
};
