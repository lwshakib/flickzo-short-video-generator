import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { script, topic, voice, videoStyle, captionStyle, title } = await req.json();

        if (!script || !topic || !voice || !videoStyle || !captionStyle || !title) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Create the video record in Prisma
        const video = await prisma.video.create({
            data: {
                userId: session.user.id,
                title,
                topic,
                voice,
                videoStyle,
                captionStyle,
                script: script, // We'll store script in the script field (wait, does Video have a script field?)
                audio: {}, // Initial empty JSON
                status: "PENDING",
            },
        });

        // 2. Trigger the Inngest function
        await inngest.send({
            name: "video.created",
            data: {
                videoId: video.id,
                userId: session.user.id,
                topic,
                voice,
                videoStyle,
                captionStyle,
                script,
            },
        });

        return NextResponse.json({ videoId: video.id });
    } catch (error: any) {
        console.error("Error creating video:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create video" },
            { status: 500 }
        );
    }
}
