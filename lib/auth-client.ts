import { createAuthClient } from "better-auth/react";

/**
 * Better-Auth client instance for use in the browser/React components.
 * This client provides hooks and methods for managing authentication state,
 * signing in, signing out, and accessing user information.
 */
export const authClient = createAuthClient({
  /**
   * The base URL of the authentication server.
   * In local development, this defaults to http://localhost:3000.
   */
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});
