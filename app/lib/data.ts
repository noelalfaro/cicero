import { Player } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { players } from "@/db/schema";

export async function fetchPlayerData() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  // noStore();

  try {
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const db = drizzle(sql);
    const result = await db.select().from(players);

    console.log("Data fetch complete after 1 second(s).");

    return result;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch player data.");
  }
}
