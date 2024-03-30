import type { Config } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });

// const databaseUrl: string = process.env.POSTGRES_URL as string;
const databaseUrl: string = process.env.DRIZZLE_DATABASE_URL as string;

export default {
  schema: "./db/schema/*.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL!,
  },
  strict: true,
} satisfies Config;
