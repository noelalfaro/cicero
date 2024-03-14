import type { Config } from "drizzle-kit";

const databaseUrl: string = process.env.POSTGRES_URL as string;

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: databaseUrl,
  },
  strict: true,
} satisfies Config;
