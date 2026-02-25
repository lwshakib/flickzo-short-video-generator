import { generateObject } from "ai";
import { GeminiModel } from "./model";
import { z } from "zod";

/**
 * Generates a structured JSON object from an AI prompt using the Vercel AI SDK.
 * This is useful for generating data that follows a specific schema, such as
 * script structures, image prompts, or metadata.
 *
 * @param prompt - The instructions for the AI.
 * @param objectSchema - A Zod schema defining the expected structure of the response.
 * @returns A promise resolving to the structured object.
 */
export const generateObjectFromAI = async (
  prompt: string,
  objectSchema: z.ZodSchema
) => {
  const response = await generateObject({
    model: GeminiModel(), // Uses the configured Gemini model
    schema: objectSchema,
    prompt,
  });
  return response.object;
};
