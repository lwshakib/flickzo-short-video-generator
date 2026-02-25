import { GOOGLE_API_KEY } from "@/lib/env";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Selects a single API key from a potential comma-separated list.
 * This allows for simple load balancing or rotation between multiple Google API keys.
 *
 * @returns A randomly selected API key string.
 */
export const getSingleApiKey = () => {
  if (!GOOGLE_API_KEY) return "";
  const keys = GOOGLE_API_KEY.split(",");
  return keys[Math.floor(Math.random() * keys.length)];
};

/**
 * Returns the Gemini model name to be used for text and object generation.
 * Currently hardcoded to 'gemini-2.0-flash-lite' (optimized for speed and cost).
 *
 * @returns The string identifier for the Gemini model.
 */
export const getModelName = () => {
  const allowedModels = ["gemini-2.0-flash-lite"];
  return allowedModels[Math.floor(Math.random() * allowedModels.length)];
};

/**
 * Initializes and returns a configured Google Generative AI model instance
 * using the Vercel AI SDK.
 *
 * @returns A Gemini model instance.
 */
export const GeminiModel = () => {
  const gemini = createGoogleGenerativeAI({
    apiKey: getSingleApiKey(),
  });

  return gemini(getModelName());
};
