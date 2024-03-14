import { players, users } from "./schema";
import { players_data } from "../app/lib/placeholder-data";
import { drizzle } from "drizzle-orm/vercel-postgres";
import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { sql } from "@vercel/postgres";

// if (!("POSTGRES_URL" in process.env)) {
//   throw new Error("DATABASE_URL not found on .env");
// }

const main = async () => {
  try {
    const db = drizzle(sql); // Create a Drizzle connection instance

    // ... Your seeding logic with db.insert(...)
    await db.insert(players).values(players_data);

    console.log("Seed done");
  } catch (error) {
    console.log(error);
  }
};

main();
