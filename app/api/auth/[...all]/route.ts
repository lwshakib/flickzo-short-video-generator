import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Universal route handler for Better-Auth.
 * This catch-all route handles all authentication requests
 * (login, logout, social callbacks, verification) by delegating
 * to the Better-Auth library.
 */
export const { POST, GET } = toNextJsHandler(auth);
