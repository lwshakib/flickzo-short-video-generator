import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { createVideo, resetDailyLimits } from "@/inngest/functions";

/**
 * Inngest API endpoint.
 * Serves the Inngest client and registers the background functions
 * so the Inngest cloud can trigger them via HTTP.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [createVideo, resetDailyLimits], // List of all background workflows
});
