"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";
import { s3Service } from "@/services/s3.services";

/**
 * Server action to cancel and delete a video.
 * Removes related assets from Cloudinary and handles Inngest cancellation.
 */
export async function deleteVideo(videoId: string) {
  try {
    // 1. Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    // 2. Fetch the video and check ownership
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== session.user.id) {
      throw new Error("You do not own this video");
    }

    // 3. Trigger Inngest cancellation event (idempotent, won't error if already completed)
    await inngest.send({
      name: "video.canceled",
      data: { videoId },
    });

    // 4. Cleanup assets from S3
    const deleteAssets = async () => {
      try {
        // Audio
        const audio = video.audio as { audioPath?: string } | null;
        if (audio?.audioPath) {
          await s3Service.deleteObject(audio.audioPath);
        }

        // Images
        const images = video.images as { path?: string }[] | null;
        if (images && images.length > 0) {
          await Promise.all(
            images.map(async (img) => {
              if (img.path) {
                await s3Service.deleteObject(img.path);
              }
            })
          );
        }
      } catch (cleanupError) {
        console.error("Failed to cleanup S3 assets (continuing to delete from DB):", cleanupError);
      }
    };

    // Execute asset cleanup
    await deleteAssets();

    // 5. Delete from database
    await prisma.video.delete({
      where: { id: videoId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete video:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}
