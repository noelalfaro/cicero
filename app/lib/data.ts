import { unstable_noStore as noStore } from "next/cache";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "@/db/schema/players";
import { playerStats } from "@/db/schema/player_stats";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import {
  playerSchema,
  Player,
  NewsArticle,
  newsArticleSchema,
  playerStatsSchema,
  PlayerStats,
} from "@/app/lib/definitions";
import { config } from "dotenv";
config({ path: ".env" });

export async function fetchPlayerData(): Promise<Player[]> {
  noStore();
  try {
    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    const db = drizzle(sql);

    // Perform a join between players and player_stats
    const result = await db
      .select()
      .from(players)
      .leftJoin(playerStats, eq(players.id, playerStats.player_id))
      .limit(10);

    // console.log(result);

    // Combine the player and stats data, handling null stats
    const combinedResult = result.map((dbPlayer) => {
      const player = dbPlayer["players"];
      const stats: PlayerStats | null = dbPlayer["player_stats"];

      // If stats is null, provide default values
      const defaultStats: PlayerStats = {
        player_id: player.id,
        stat_id: 0,
        points: 23,
        min: "",
        fgm: 0,
        fga: 0,
        fgp: "",
        ftm: 0,
        fta: 0,
        ftp: "",
        tpm: 0,
        tpa: 0,
        tpp: "",
        offReb: 0,
        defReb: 0,
        totReb: 0,
        assists: 0,
        pFouls: 0,
        steals: 0,
        turnovers: 0,
        blocks: 0,
        plusMinus: "",
      };

      // Combine player and stats, using defaultStats if stats is null
      return {
        ...player,
        stats: stats || defaultStats,
      };
    });
    // console.log(combinedResult);
    return combinedResult.map((dbPlayer) => playerSchema.parse(dbPlayer));
  } catch (error) {
    throw new Error("Failed to fetch player data: " + error);
  }
}

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const url = "https://nba-latest-news.p.rapidapi.com/articles";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY!,
      "X-RapidAPI-Host": "nba-latest-news.p.rapidapi.com",
    },
  };
  noStore();

  try {
    const response = await fetch(url, options);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Fetched data: ", data);

    // Assuming 'data' is an array of articles
    return data.map((article: any) => newsArticleSchema.parse(article));
  } catch (error) {
    console.error("Error fetching articles: ", error);
    throw new Error("Failed to fetch articles data.");
  }
}

export async function fetchPlayerDataByID(id: number): Promise<Player | null> {
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  const db = drizzle(sql);
  const result = await db.select().from(players).where(eq(players.id, id));

  // console.log(result);

  try {
    if (result.length === 0) {
      return null;
    }

    // console.log(result[0]);

    const combinedResult = result.map((result) => {
      const player = result;
      // const stats: PlayerStats ;

      // If stats is null, provide default values
      const defaultStats: PlayerStats = {
        player_id: player.id,
        stat_id: 0,
        points: 23,
        min: "",
        fgm: 0,
        fga: 0,
        fgp: "",
        ftm: 0,
        fta: 0,
        ftp: "",
        tpm: 0,
        tpa: 0,
        tpp: "",
        offReb: 0,
        defReb: 0,
        totReb: 0,
        assists: 0,
        pFouls: 0,
        steals: 0,
        turnovers: 0,
        blocks: 0,
        plusMinus: "",
      };

      // Combine player and stats, using defaultStats if stats is null
      return {
        ...player,
        stats: defaultStats,
      };
    });
    // console.log(combinedResult);

    return playerSchema.parse(result[0]);
  } catch (error) {
    throw new Error("Failed to fetch player data by id");
  }
}
