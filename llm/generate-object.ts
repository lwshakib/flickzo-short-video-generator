import type { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { CHAT_MODEL_ID } from "@/llm/constants";
import { getGoogleGenAI } from "@/llm/client";
import type { GenerateObjectOptions } from "@/llm/types";

/**
 * Structured JSON via Gemini chats + optional Zod (`tmp/code_examples.md`).
 */
export async function generateObject<T>(
  options: GenerateObjectOptions<Record<string, unknown>>,
  client?: GoogleGenAI
): Promise<T> {
  const { messages, outputSchema, temperature } = options;
  const ai = client ?? getGoogleGenAI();

  const schemaUnknown = outputSchema as unknown;
  const jsonSchema = (
    schemaUnknown !== null &&
    typeof schemaUnknown === "object" &&
    "safeParse" in schemaUnknown &&
    typeof (schemaUnknown as { safeParse: unknown }).safeParse === "function"
      ? (zodToJsonSchema as (s: unknown) => Record<string, unknown>)(
          schemaUnknown
        )
      : schemaUnknown
  ) as Record<string, unknown>;

  const systemInstruction =
    messages.find((m) => m.role === "system")?.content ?? undefined;

  const conversationMessages = messages.filter((m) => m.role !== "system");

  const history = conversationMessages.slice(0, -1).map((m) => {
    const parts: Record<string, unknown>[] = [];
    if (typeof m.content === "string") {
      parts.push({ text: m.content });
    }
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts,
    };
  });

  const lastMessage = conversationMessages[conversationMessages.length - 1];
  if (!lastMessage) {
    throw new Error("generateObject requires at least one message");
  }
  const lastMessageContent = lastMessage.content;

  const chat = ai.chats.create({
    model: CHAT_MODEL_ID,
    history,
    config: {
      systemInstruction,
      temperature: temperature ?? 1,
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchema,
    },
  });

  const response = await chat.sendMessage({
    message: lastMessageContent,
  });

  if (!response.text) {
    throw new Error(
      "Gemini: empty response body for structured output (generateObject)"
    );
  }

  try {
    return JSON.parse(response.text) as T;
  } catch {
    console.error("Gemini: Failed to parse structured output:", response.text);
    throw new Error("Gemini returned invalid JSON for generateObject");
  }
}
