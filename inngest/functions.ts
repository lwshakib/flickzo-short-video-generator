import { inngest } from "./client";

export const createVideo = inngest.createFunction(
  {
    id: "create-video",
    cancelOn: [
      {
        event: "video.canceled",
        match: "data.videoId",
      },
    ],
  },
  {
    event: "video.created",
  },
  async ({ event, step }) => {
    const { videoId, userId, topic, voice, videoStyle, captionStyle, audio } = event?.data;
    try {
      const audioData = await step.run('generate-audio', async()=>{

      });

      const captionsData = await step.run('generate-captions', async()=>{

      });

      const imagesData = await step.run('generate-images', async()=>{

      });

      return true;
    } catch (error: any) {
      return false;
    }
  }
)