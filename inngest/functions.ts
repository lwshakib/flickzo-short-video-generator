import { inngest } from "./client";
import { generateAudio, generateCaptions, generateImages } from "./helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

/**
 * Inngest function to handle the entire video creation workflow.
 * This function is triggered by the "video.created" event and performs
 * several asynchronous steps: audio generation, transcription, image generation,
 * and database updates.
 */
export const createVideo = inngest.createFunction(
  {
    id: "create-video",
    // Cancellation policy: if a "video.canceled" event is received with the same videoId,
    // this function execution will be stopped.
    cancelOn: [
      {
        event: "video.canceled",
        match: "data.videoId",
      },
    ],
    // Number of retries in case of failure
    retries: 3,
  },
  {
    // Trigger event
    event: "video.created",
  },
  async ({ event, step, publish }) => {
    // Extract video metadata from the event payload
    const { videoId, userId, voice, videoStyle, script } = event?.data;

    try {
      // Step 0: Publish initial status update to Inngest Realtime.
      // This allows the sidebar/UI to show a "PENDING" state immediately.
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "PENDING",
        },
      });

      // Step 1: Generate Audio and upload to Cloudinary.
      // We wrap this in step.run for reliability and observability.
      const audioData = await step.run("generate-audio", async () => {
        return await generateAudio(script, voice);
      });

      // Step 2: Generate Captions using Deepgram.
      // This step transcribes the generated audio and provides timed word data.
      const captionsData = await generateCaptions(audioData.audioUrl, step);

      // Step 3: Generate Images using Flux (AI model).
      // Based on the script and style, this generates multiple scene-appropriate images.
      const imagesData = await generateImages(script, videoStyle, step);

      // Step 4: Update the Database with all generated assets.
      // We store the audio URL, captions (timed words), and generated images.
      await step.run("update-db-completed", async () => {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            audio: audioData as unknown as Prisma.InputJsonValue,
            captions: captionsData as unknown as Prisma.InputJsonValue[],
            images: imagesData as unknown as Prisma.InputJsonValue[],
            status: "COMPLETED",
          },
        });
      });

      // Step 5: Publish a final success update to the user.
      // This updates the UI once the entire process is finished.
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "COMPLETED",
        },
      });

      return { success: true, videoId };
    } catch (error: unknown) {
      // Log the error for debugging purposes
      console.error("Video generation failed:", error);

      // Step 6 (on error): Mark the video as FAILED in the database.
      await step.run("update-db-failed", async () => {
        await prisma.video.update({
          where: { id: videoId },
          data: {
            status: "FAILED",
          },
        });
      });

      // Step 7 (on error): Notify the user that the generation failed.
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "FAILED",
        },
      });

      // Re-throw the error so Inngest knows the function failed and can retry if configured.
      throw error;
    }
  }
);
