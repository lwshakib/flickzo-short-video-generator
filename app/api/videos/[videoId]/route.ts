import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { deleteFromCloudinary } from "@/lib/cloudinary";

/**
 * Single Video Detail API.
 * Returns the full JSON object for a specific video record.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await params;

    // Fetch the specific video while ensuring it belongs to the requester
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session.user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: unknown) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch video",
      },
      { status: 500 }
    );
  }
}

/**
 * Video Deletion & Cancellation API.
 * Permanently removes a video record and cancels any active generation
 * background processes if applicable.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await params;

    // 1. Verify ownership and existence
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: session.user.id,
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    /**
     * 2. If the video is still "PENDING", attempt to cancel the Inngest workflow.
     * This saves computational resources (API credits) by stopping generation.
     */
    if (video.status === "PENDING") {
      await inngest.send({
        name: "video.canceled",
        data: {
          videoId: video.id,
        },
      });
    }

    // 3. Cleanup assets from Cloudinary
    const audio = video.audio as any;
    if (audio?.publicId) {
      await deleteFromCloudinary(audio.publicId, "video");
    }

    const images = video.images as any[];
    if (images && images.length > 0) {
      await Promise.all(
        images.map((img: any) => {
          if (img.publicId) {
            return deleteFromCloudinary(img.publicId, "image");
          }
        })
      );
    }

    // 4. Purge the record from the database
    await prisma.video.delete({
      where: {
        id: videoId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete video",
      },
      { status: 500 }
    );
  }
}
