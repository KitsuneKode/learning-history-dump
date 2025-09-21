import { Type, type FunctionDeclaration } from "@google/genai";
export const multiply: FunctionDeclaration = {
  name: "get_multiplication",
  description: "Calculates the multiplication between two numbers",
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

export const executeMultiply = (a: number, b: number): number => {
  return a * b;
};
