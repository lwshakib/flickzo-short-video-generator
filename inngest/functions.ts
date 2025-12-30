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
    const { videoId } = event?.data;
    try {

      return true;
    } catch (error: any) {
      return false;
    }
  }
)