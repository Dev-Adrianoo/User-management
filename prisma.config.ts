import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts --project tsconfig.seed.json"
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});