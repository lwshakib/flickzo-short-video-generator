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

// Google API keys (potentially for Gemini or other services)
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Cloudinary credentials for image and audio storage
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

// Database connection string for Prisma
export const DATABASE_URL = process.env.DATABASE_URL;

// Deepgram API key for TTS and Speech-to-Text
export const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

// Nebius API key (potentially for specialized compute or AI models)
export const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;
