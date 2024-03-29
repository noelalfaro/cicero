import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { config } from "dotenv";
config({ path: ".env" });

const databaseUrl: string = process.env.DRIZZLE_DATABASE_URL as string;

const sql = neon(databaseUrl);
export const db = drizzle(sql);

await migrate(db, { migrationsFolder: "drizzle" });
