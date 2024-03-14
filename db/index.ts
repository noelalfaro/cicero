import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres"; // Use the @vercel/postgres client

const db = drizzle(sql); // Create a Drizzle connection using the Vercel client

await migrate(db, { migrationsFolder: "drizzle" });

// You don't need sql.end() with the Vercel Postgres client
