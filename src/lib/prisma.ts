import { PrismaClient } from "@prisma/client/";

const globalForPrsima = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrsima.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrsima.prisma = prisma