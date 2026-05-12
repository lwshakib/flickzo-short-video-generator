/**
 * Environment variable configuration.
 * This file centralizes all environment variables used throughout the application,
 * providing a single point of access and potentially validation in the future.
 */

// Better-Auth secrets and URLs
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;

// Google OAuth credentials
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Google AI (Gemini / Gen AI SDK)
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/** Deepgram (TTS STT flows from tmp/code_examples.md) */
export const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// Media Storage (AWS S3 / Cloudflare R2)
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ENDPOINT = process.env.AWS_ENDPOINT;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Database connection string for Prisma
export const DATABASE_URL = process.env.DATABASE_URL;
