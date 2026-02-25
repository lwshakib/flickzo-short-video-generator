import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

/**
 * Video Production Initialization API.
 * Secure endpoint that creates a video record in the database and
 * kicks off the background generation workflow via Inngest.
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate the request
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract and validate video configuration
    const { script, topic, voice, videoStyle, captionStyle, title } =
      await req.json();

    if (!script || !topic || !voice || !videoStyle || !captionStyle || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Create the initial "PENDING" video record in Prisma
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title,
        topic,
        voice,
        videoStyle,
        captionStyle,
        script: script,
        audio: {}, // Initial empty JSON metadata
        status: "PENDING",
      },
    });

    /**
     * 4. Hand off the heavy lifting to Inngest.
     * We send a 'video.created' event which triggers the asynchronous
     * generation of audio, captions, and images.
     */
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
  } catch (error: unknown) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create video",
      },
      { status: 500 }
    );
  }
}
