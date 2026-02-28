import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

/**
 * Inngest client initialization.
 * This client is used throughout the application to send and receive events,
 * allowing for reliable asynchronous workflows.
 */
export const inngest = new Inngest({
  // Unique identifier for the application within Inngest
  id: "flickzo-short-video-generator",
  // Middleware to enable real-time event capabilities,
  // allowing the frontend to receive updates via Inngest Realtime.
  middleware: [realtimeMiddleware()],
  eventKey: process.env.INNGEST_EVENT_KEY,
});
