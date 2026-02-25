import { NextResponse } from "next/server";
import { generateObjectFromAI } from "@/llm/generateObject";
import { SCRIPT_GENERATE_PROMPT } from "@/llm/prompts";
import { z } from "zod";

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

    // 1. Prepare the prompt with the user's topic
    const prompt = SCRIPT_GENERATE_PROMPT.replace("{{TOPIC}}", topic);

    // 2. Define the expected JSON structure using Zod
    const schema = z.object({
      scripts: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
        })
      ),
    });

    // 3. Request structured data from the LLM
    const object = await generateObjectFromAI(prompt, schema);

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
