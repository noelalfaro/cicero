import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "@/db/schema/players";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
// config({ path: ".env" });
import { eq } from "drizzle-orm";
import { playerSchema, Player } from "@/app/lib/definitions";

export async function fetchPlayerData(): Promise<Player[]> {
  noStore();
  try {
    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    const db = drizzle(sql);
    const result = await db.select().from(players);
    return result.map((dbPlayer) => playerSchema.parse(dbPlayer));
  } catch (error) {
    throw new Error("Failed to fetch player data.");
  }
}

export async function fetchNewsArticles() {
  const url = "https://nba-latest-news.p.rapidapi.com/articles";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.rapid_api_key!,
      "X-RapidAPI-Host": "nba-latest-news.p.rapidapi.com",
    },
  };
  // noStore();

  try {
    const response = await fetch(url, options);

    return response;
  } catch (error) {
    console.error("error fetching news articles", error);
  }
}

export async function fetchPlayerDataByID(
  player_id: number,
): Promise<Player | null> {
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  const db = drizzle(sql);
  const result = await db
    .select()
    .from(players)
    .where(eq(players.player_id, player_id));

  if (result.length === 0) {
    return null;
  }
  return playerSchema.parse(result[0]);
}
