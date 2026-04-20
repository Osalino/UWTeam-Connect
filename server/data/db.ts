// Import the generated Prisma Client
// This client is automatically generated from your schema.prisma file
import { PrismaClient } from "@prisma/client";

// Create a type-safe global variable to store the Prisma instance
// This prevents multiple instances in development with hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma Client instance
// Prisma 6 works directly with SQLite without needing adapters
// The database URL comes from the .env file or prisma/schema.prisma
export const prisma = globalForPrisma.prisma || new PrismaClient();

// Store the Prisma instance globally in development
// This ensures we don't create multiple database connections during hot-reload
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
