/**
 * Separate Prisma client for intake submissions.
 * Points to the Admin database so submissions are immediately visible
 * in the Admin dashboard without any cross-DB plumbing.
 */
import { PrismaClient } from "@prisma/client";

const globalForIntake = globalThis as unknown as {
  intakePrisma: PrismaClient | undefined;
};

const intakePrisma =
  globalForIntake.intakePrisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.ADMIN_DATABASE_URL ?? process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForIntake.intakePrisma = intakePrisma;
}

export default intakePrisma;
