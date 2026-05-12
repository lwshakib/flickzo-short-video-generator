import { GoogleGenAI } from "@google/genai";
import { GOOGLE_API_KEY } from "@/lib/env";

let client: GoogleGenAI | null = null;

/** Shared `@google/genai` client keyed by `GOOGLE_API_KEY`. */
export function getGoogleGenAI(): GoogleGenAI {
  const apiKey = GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not set");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}
