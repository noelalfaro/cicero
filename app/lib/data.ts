import { Player } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "@/db/schema/players";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env" });

export async function fetchPlayerData() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    const db = drizzle(sql);
    const result = await db.select().from(players);

    // console.log("Data fetch complete after 1 second(s).");

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch player data.");
  }
}
