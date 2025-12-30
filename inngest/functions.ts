import { inngest } from "./client";
import { generateAudio, generateCaptions, generateImages } from "./helpers";
import prisma from "@/lib/prisma";

export const createVideo = inngest.createFunction(
  {
    id: "create-video",
    cancelOn: [
      {
        event: "video.canceled",
        match: "data.videoId",
      },
    ],
    retries: 3,
  },
  {
    event: "video.created",
  },
  async ({ event, step, publish }) => {
    const { videoId, userId, topic, voice, videoStyle, captionStyle, script } = event?.data;

    try {
      // 0. Publish initial status to sync sidebar immediately
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "PENDING",
        },
      });

      // 1. Generate Audio and upload to Cloudinary
      const audioData = await step.run('generate-audio', async () => {
        return await generateAudio(script, voice);
      });

      // 2. Generate Captions using Deepgram
      const captionsData = await generateCaptions(audioData.audioUrl, step);

      // 3. Generate Images using Flux
      const imagesData = await generateImages(script, videoStyle, step);

      // 4. Update Database with all generated content
      await step.run('update-db-completed', async () => {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            audio: audioData,
            captions: captionsData,
            images: imagesData,
            status: "COMPLETED",
          },
        });
      });

      // 5. Publish success update
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "COMPLETED",
        },
      });

      return { success: true, videoId };
    } catch (error: any) {
      console.error("Video generation failed:", error);

      await step.run('update-db-failed', async () => {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            status: "FAILED",
          },
        });
      });

      // Publish failed update
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "FAILED",
        },
      });

      throw error; // Re-throw for Inngest to handle retries
    }
  }

)