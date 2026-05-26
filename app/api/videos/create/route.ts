import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { DAILY_FREE_VIDEO_LIMIT } from "@/lib/constants";

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

    // 3. Check, Create, and Update in a single transaction to prevent race conditions
    try {
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { dailyVideosGenerated: true, lastResetDate: true },
        });

        if (!user) throw new Error("User not found");

        const now = new Date();
        const lastReset = new Date(user.lastResetDate);
        const isNewDay =
          now.getUTCDate() !== lastReset.getUTCDate() ||
          now.getUTCMonth() !== lastReset.getUTCMonth() ||
          now.getUTCFullYear() !== lastReset.getUTCFullYear();

        const currentDailyCount = isNewDay ? 0 : user.dailyVideosGenerated;

        if (currentDailyCount >= DAILY_FREE_VIDEO_LIMIT) {
          throw new Error("DAILY_LIMIT_REACHED");
        }

        // Create video record
        const video = await tx.video.create({
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

        // Increment the daily counter
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            dailyVideosGenerated: isNewDay ? 1 : { increment: 1 },
            lastResetDate: isNewDay ? now : user.lastResetDate,
          },
        });

        return { videoId: video.id };
      });

      /**
       * 4. Hand off the heavy lifting to Inngest.
       */
      await inngest.send({
        name: "video.created",
        data: {
          videoId: result.videoId,
          userId: session.user.id,
          topic,
          voice,
          videoStyle,
          captionStyle,
          script,
        },
      });

      return NextResponse.json({ videoId: result.videoId });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "DAILY_LIMIT_REACHED") {
        return NextResponse.json(
          {
            error:
              "Daily limit reached. Pro accounts are coming soon for more videos!",
          },
          { status: 429 }
        );
      }
      throw error;
    }
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
