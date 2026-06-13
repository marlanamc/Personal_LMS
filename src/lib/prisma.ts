import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prefer a POOLED connection string in serverless environments. On Vercel each
// lambda invocation opens its own connection, so an un-pooled URL exhausts
// Postgres `max_connections` under load ("too many connections" errors).
// `POSTGRES_PRISMA_URL` is Vercel's pgbouncer-pooled URL intended for Prisma
// Client; fall back to the direct URLs only if no pooled URL is configured.
// See .env.example for the recommended `?pgbouncer=true&connection_limit=...`
// query params when supplying your own pooled endpoint.
const connectionUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.STORAGE_POSTGRES_URL ||
    process.env.STORAGE_PRISMA_DATABASE_URL;

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: connectionUrl,
            },
        },
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
