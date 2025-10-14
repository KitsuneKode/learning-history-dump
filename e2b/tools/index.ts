import type Sandbox from "@e2b/code-interpreter";
import { z } from "zod";

export const createFile = (sandbox: Sandbox) => ({
  description: "Create a file at a certain directory",
  inputSchema: z.object({
    location: z.string().describe("Relative path to the file"),
  }),
  execute: async ({ location }: { location: string }) => {
    await sandbox.files.write(location, "");
    return `File created`;
  },
});

export const updateFile = (sandbox: Sandbox) => ({
  description: "Update a file at a certain directory",
  inputSchema: z.object({
    location: z.string().describe("Relative path to the file"),
    content: z.string().describe("Content of the file"),
  }),
  execute: async ({
    location,
    content,
  }: {
    location: string;
    content: string;
  }) => {
    await sandbox.files.write(location, content);
    return `File updated`;
  },
});

export const deleteFile = (sandbox: Sandbox) => ({
  description: "Delete a file at a certain directory",
  inputSchema: z.object({
    location: z.string().describe("Relative path to the file"),
  }),
  execute: async ({ location }: { location: string }) => {
    await sandbox.files.remove(location);
    return `File deleted`;
  },
});

export const readFile = (sandbox: Sandbox) => ({
  description: "Read a file at a certain directory",
  inputSchema: z.object({
    location: z.string().describe("Relative path to the file"),
  }),
  execute: async ({ location }: { location: string }) => {
    return `File Contents`;
  },
});
