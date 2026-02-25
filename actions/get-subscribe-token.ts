"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken } from "@inngest/realtime";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Server action to generate a secure subscription token for Inngest Realtime.
 * This token allows the frontend to securely listen for status updates (topics)
 * regarding video generation milestones.
 *
 * @returns A unique JWT token for real-time communication.
 */
export async function fetchRealtimeSubscriptionToken() {
  // 1. Authenticate the request using Better-Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  /**
   * 2. Create a restricted subscription token.
   * This token is scoped to a specific user's channel and the "video.status" topic,
   * ensuring users can only receive updates for their own videos.
   */
  const token = await getSubscriptionToken(inngest, {
    channel: `user:${userId}`,
    topics: ["video.status"],
  });

  return token;
}
