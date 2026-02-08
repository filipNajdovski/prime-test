import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
let prismaClient: PrismaClient;

if (connectionString) {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  prismaClient =
    global.prisma ||
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prismaClient;
  }
} else {
  // Fallback to default PrismaClient if no DATABASE_URL is provided (useful for tests)
  prismaClient =
    global.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

  if (process.env.NODE_ENV !== "production") {
    global.prisma = prismaClient;
  }
}

export const prisma = prismaClient;

export default prisma;
