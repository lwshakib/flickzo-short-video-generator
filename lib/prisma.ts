import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma Client initialization.
 * This setup uses the `@prisma/adapter-pg` to work with traditional PostgreSQL
 * connections while following a singleton pattern to prevent multiple instances
 * in development (especially during Hot Module Replacement).
 */

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required to initialize Prisma. Set it before running database queries."
    );
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Global variable to hold the Prisma client instance
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ??
  (process.env.DATABASE_URL?.trim()
    ? createPrismaClient()
    : new Proxy({} as PrismaClient, {
        get() {
          throw new Error(
            "Prisma client is unavailable because DATABASE_URL is not set."
          );
        },
      }));

// In development, store the instance on the global object to persist across reloads
if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL?.trim()) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
