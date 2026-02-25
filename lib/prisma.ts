import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma Client initialization.
 * This setup uses the `@prisma/adapter-pg` to work with traditional PostgreSQL
 * connections while following a singleton pattern to prevent multiple instances
 * in development (especially during Hot Module Replacement).
 */

// Construct the database connection string from environment variables
const connectionString = `${process.env.DATABASE_URL}`;

// Initialize the PostgreSQL adapter
const adapter = new PrismaPg({ connectionString });

// Global variable to hold the Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use the existing global instance if available, otherwise create a new one
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// In development, store the instance on the global object to persist across reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
