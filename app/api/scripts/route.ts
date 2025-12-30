import { NextResponse } from "next/server";
import { generateObjectFromAI } from "@/llm/generateObject";
import { SCRIPT_GENERATE_PROMPT } from "@/llm/prompts";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const prompt = SCRIPT_GENERATE_PROMPT.replace("{{TOPIC}}", topic);

        const schema = z.object({
            scripts: z.array(
                z.object({
                    title: z.string(),
                    content: z.string(),
                })
            ),
        });

        const object = await generateObjectFromAI(prompt, schema);

        return NextResponse.json({ data: object });
    } catch (error: any) {
        console.error("Error generating script:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate script" },
            { status: 500 }
        );
    }
}
