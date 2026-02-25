import { inngest } from "./client";
import { generateAudio, generateCaptions, generateImages } from "./helpers";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { resend } from "@/lib/resend";
import { NotificationEmail } from "@/components/emails/notification-email-template";

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
          await resend.emails.send({
            from: "Flickzo <noreply@lwshakib.site>",
            to: videoData.user.email,
            subject: "Video generation failed",
            react: NotificationEmail({
              userName: videoData.user.name,
              type: "FAILURE",
              videoTitle: videoData.title,
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/home`,
            }),
          });
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

    // Step 1: Generate Audio and upload to Cloudinary.
    const audioData = await step.run("generate-audio", async () => {
      return await generateAudio(script, voice);
    });

    // Step 2: Generate Captions using Deepgram.
    const captionsData = await generateCaptions(audioData.audioUrl, step);

    // Step 3: Generate Images using Flux (AI model).
    const imagesData = await generateImages(script, videoStyle, step);

    // Step 4: Update the Database with all generated assets.
    const video = await step.run("update-db-completed", async () => {
      return await prisma.video.update({
        where: { id: videoId },
        data: {
          audio: audioData as unknown as Prisma.InputJsonValue,
          captions: captionsData as unknown as Prisma.InputJsonValue[],
          images: imagesData as unknown as Prisma.InputJsonValue[],
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
        await resend.emails.send({
          from: "Flickzo <noreply@lwshakib.site>",
          to: video.user.email,
          subject: "Your video is ready!",
          react: NotificationEmail({
            userName: video.user.name,
            type: "SUCCESS",
            videoTitle: video.title,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/videos/${videoId}`,
          }),
        });
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
