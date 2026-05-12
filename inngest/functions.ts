import { inngest } from "./client";
import { generateVideoAudio, transcribeAudio, generateImages } from "./helpers";
import prisma from "@/lib/prisma";
import type { InputJsonValue } from "@prisma/client/runtime/client";
import { sendFailureEmail, sendSuccessEmail } from "@/lib/resend";

/**
 * Inngest function to handle the entire video creation workflow.
 * This function is triggered by the "video.created" event and performs
 * several asynchronous steps: audio generation, transcription, image generation,
 * and database updates.
 */
export const createVideo = inngest.createFunction(
  {
    id: "create-video",
    cancelOn: [
      {
        event: "video.canceled",
        match: "data.videoId",
      },
    ],
    retries: 5,
    /**
     * onFailure is triggered after all retries are exhausted.
     * We use this to mark the video as FAILED, create a database notification,
     * and send an error email to the user.
     */
    onFailure: async ({ event, step }) => {
      const originalEvent = event.data.event as {
        data: { videoId: string; userId: string };
      };
      const { videoId, userId } = originalEvent.data;

      // Log the final failure
      console.error(
        `Video generation permanently failed for videoId: ${videoId}`
      );

      // Step 1: Mark the video as FAILED in the database.
      const videoData = await step.run("update-db-failed", async () => {
        return await prisma.video.update({
          where: { id: videoId },
          data: {
            status: "FAILED",
          },
          include: {
            user: true,
          },
        });
      });

      // Step 2: Create Error Notification
      await step.run("create-failure-notification", async () => {
        if (videoData) {
          await prisma.notification.create({
            data: {
              userId,
              videoId,
              title: "Video Generation Failed",
              message: `We encountered an issue while generating "${videoData.title}". Please try again.`,
              type: "FAILURE",
            },
          });
        }
      });

      // Step 3: Send Failure Email
      await step.run("send-failure-email", async () => {
        if (videoData?.user?.email) {
          await sendFailureEmail(
            videoData.user.email,
            videoData.user.name || "User",
            videoData.title
          );
        }
      });

      // Note: Realtime status update is not easily accessible in onFailure without the publish helper.
      // The user will still receive a notification and an email.
    },
  },
  {
    event: "video.created",
  },
  async ({ event, step, publish }) => {
    const { videoId, userId, voice, videoStyle, script } = event?.data;

    // Step 0: Publish initial status update to Inngest Realtime.
    await publish({
      channel: `user:${userId}`,
      topic: "video.status",
      data: {
        videoId,
        status: "PENDING",
      },
    });

    // Step 1: Generate Audio and upload to S3.
    const audioData = await step.run("generate-audio", async () => {
      const result = await generateVideoAudio(script, voice);

      // Persist audio path immediately so it can be cleaned up if canceled
      await prisma.video.update({
        where: { id: videoId },
        data: {
          audio: result as unknown as InputJsonValue,
        },
      });

      return result;
    });

    // Step 2: Generate Captions using Deepgram.
    const captionsData = await transcribeAudio(audioData.audioPath, step);

    // Step 3: Generate Images using Flux (AI model).
    const imagesData = await generateImages(script, videoStyle, step);

    // Step 4: Finalize the Record in the Database.
    const video = await step.run("finalize-db-record", async () => {
      return await prisma.video.update({
        where: { id: videoId },
        data: {
          captions: captionsData as unknown as InputJsonValue[],
          images: imagesData as unknown as InputJsonValue[],
          status: "COMPLETED",
        },
        include: {
          user: true,
        },
      });
    });

    // Step 5: Create Database Notification
    await step.run("create-success-notification", async () => {
      await prisma.notification.create({
        data: {
          userId,
          videoId,
          title: "Video Generated Successfully",
          message: `Your video "${video.title}" is ready and waiting for you!`,
          type: "SUCCESS",
        },
      });
    });

    // Step 6: Send Success Email
    await step.run("send-success-email", async () => {
      if (video.user?.email) {
        await sendSuccessEmail(
          video.user.email,
          video.user.name || "User",
          video.title,
          videoId
        );
      }
    });

    // Step 7: Publish a final success update to the user.
    await step.run("publish-success-status", async () => {
      await publish({
        channel: `user:${userId}`,
        topic: "video.status",
        data: {
          videoId,
          status: "COMPLETED",
        },
      });
    });

    return { success: true, videoId };
  }
);

/**
 * Scheduled function to reset daily limits for all users at 12:00 AM UTC.
 */
export const resetDailyLimits = inngest.createFunction(
  { id: "reset-daily-limits" },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    await step.run("reset-db-stats", async () => {
      return await prisma.user.updateMany({
        data: {
          dailyVideosGenerated: 0,
          lastResetDate: new Date(),
        },
      });
    });

    return { success: true };
  }
);
