import type { Config } from "drizzle-kit";
import { config } from "dotenv";
// config({ path: ".env.local" });

export default {
  schema: "./db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  strict: true,
} satisfies Config;
