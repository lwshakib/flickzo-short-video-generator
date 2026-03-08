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

    // 3. Check and update daily video generation limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dailyVideosGenerated: true, lastResetDate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const lastReset = new Date(user.lastResetDate);
    const isNewDay =
      now.getUTCDate() !== lastReset.getUTCDate() ||
      now.getUTCMonth() !== lastReset.getUTCMonth() ||
      now.getUTCFullYear() !== lastReset.getUTCFullYear();

    let currentDailyCount = user.dailyVideosGenerated;

    if (isNewDay) {
      currentDailyCount = 0;
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          dailyVideosGenerated: 0,
          lastResetDate: now,
        },
      });
    }

    if (currentDailyCount >= 5) {
      return NextResponse.json(
        {
          error:
            "Daily limit reached. Pro accounts are coming soon for more videos!",
        },
        { status: 429 }
      );
    }

    // 4. Create the initial "PENDING" video record in Prisma
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title,
        topic,
        voice,
        videoStyle,
        captionStyle: captionStyle as object,
        script: script,
        audio: {}, // Initial empty JSON metadata
        status: "PENDING",
      },
    });

    // 5. Increment the daily counter
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyVideosGenerated: { increment: 1 },
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
