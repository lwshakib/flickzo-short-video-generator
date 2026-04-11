import { NextResponse } from "next/server";
import { aiService } from "@/services/ai.services";
import { SCRIPT_GENERATE_PROMPT } from "@/lib/prompts";

/**
 * AI Script Generation API.
 * Receives a topic and uses an LLM to generate multiple narrative script
 * options for the user to choose from.
 */
export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 2. Define the expected JSON structure using a raw JSON Schema
    const schema = {
      type: "object",
      properties: {
        scripts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
            },
            required: ["title", "content"],
            additionalProperties: false,
          },
        },
      },
      required: ["scripts"],
      additionalProperties: false,
    };

    // 3. Request structured data from the LLM via AIService
    const object = await aiService.generateObject({
      messages: [
        { role: "system", content: SCRIPT_GENERATE_PROMPT },
        { role: "user", content: `Topic: ${topic}` },
      ],
      outputSchema: schema,
    });

    return NextResponse.json({ data: object });
  } catch (error: unknown) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate script",
      },
      { status: 500 }
    );
  }
}
