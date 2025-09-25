import { Type, type FunctionDeclaration } from "@google/genai";
export const power: FunctionDeclaration = {
  name: "get_exponent",
  description:
    "Calculates the exponent of a by the value of b. Example 2^3 = 8 ",
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

export const executeExponent = (a: number, b: number): number => {
  return a ** b;
};
