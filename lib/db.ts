import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple Prisma instances in development
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
