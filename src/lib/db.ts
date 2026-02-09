import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
let prismaClient: PrismaClient;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL or DIRECT_URL environment variable.");
}

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

export const prisma = prismaClient;

export default prisma;
