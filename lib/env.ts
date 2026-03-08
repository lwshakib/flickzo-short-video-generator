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

// Aura-2 worker for audio generation
export const AURA_2_EN_WORKER_URL = process.env.AURA_2_EN_WORKER_URL;

// Nova-3 worker for audio transcription (captions)
export const NOVA_3_WORKER_URL = process.env.NOVA_3_WORKER_URL;

// GLM worker for structured objects
export const GLM_WORKER_URL = process.env.GLM_WORKER_URL;

// Cloudflare API key for authentication with workers
export const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

// Flux Klein worker for image generation
export const FLUX_KLEIN_WORKER_URL = process.env.FLUX_KLEIN_WORKER_URL;
