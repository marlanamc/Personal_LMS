
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url:
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.STORAGE_POSTGRES_URL ||
      process.env.STORAGE_PRISMA_DATABASE_URL ||
      "file:./dev.db",
  },
});
