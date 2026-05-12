import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma Client initialization.
 * This setup uses the `@prisma/adapter-pg` to work with traditional PostgreSQL
 * connections while following a singleton pattern to prevent multiple instances
 * in development (especially during Hot Module Replacement).
 */

// PrismaPg requires a URL string; `next build` and `prisma generate` run without
// DATABASE_URL in CI. Use a well-formed placeholder — real queries still need a
// working DATABASE_URL at runtime.
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

// Initialize the PostgreSQL adapter
const adapter = new PrismaPg({ connectionString });

// Global variable to hold the Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use the existing global instance if available, otherwise create a new one
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// In development, store the instance on the global object to persist across reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
