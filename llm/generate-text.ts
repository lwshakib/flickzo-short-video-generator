import type { GoogleGenAI } from "@google/genai";
import { CHAT_MODEL_ID } from "@/llm/constants";
import { getGoogleGenAI } from "@/llm/client";
import type { GenerateTextOptions } from "@/llm/types";

/** Non-streaming chat completion (`tmp/code_examples.md`). */
export async function generateText(
  options: GenerateTextOptions,
  client?: GoogleGenAI
): Promise<string> {
  const { messages, temperature } = options;
  const ai = client ?? getGoogleGenAI();

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
    throw new Error("generateText requires at least one message");
  }

  const chat = ai.chats.create({
    model: CHAT_MODEL_ID,
    history,
    config: {
      systemInstruction,
      temperature: temperature ?? 1,
    },
  });

  const response = await chat.sendMessage({
    message: lastMessage.content,
  });

  return response.text ?? "";
}
