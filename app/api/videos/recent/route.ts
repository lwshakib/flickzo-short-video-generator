import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolveVideoThumbnail } from "@/lib/video-utils";

/**
 * Recent Activity API.
 * Retrieves a limited list of the user's most recently interacted-with videos.
 */
export async function GET(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Query the database for the 5 latest videos
    const videos = await prisma.video.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Return a small subset for efficiency
    });

    // 3. Resolve thumbnails using server utility
    const resolvedVideos = await Promise.all(
      videos.map((video) => resolveVideoThumbnail(video))
    );

    return NextResponse.json(resolvedVideos);
  } catch (error: unknown) {
    console.error("Error fetching recent videos:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch recent videos",
      },
      { status: 500 }
    );
  }
}
