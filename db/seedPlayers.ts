import { config } from "dotenv";
config({ path: ".env.local" });
import { Player, playerSchema } from "@/app/lib/definitions";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "@/db/schema/players";
import { z } from "zod";

async function fetchPlayerDataFromAPI() {
  const apiKey = process.env.RAPID_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RAPID_API_KEY is not defined in the environment variables",
    );
  }

  const baseUrl = "https://api-nba-v1.p.rapidapi.com/players?";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
  };

  const teamIds = [41];
  // 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25,
  // 26, 27, 28, 29, 30, 31, 38, 40, 41,

  try {
    // Use Promise.all to handle multiple API calls concurrently
    const responses = await Promise.all(
      teamIds.map(async (team_id) => {
        const newUrl = `${baseUrl}team=${team_id}&season=2023`;
        const response = await fetch(newUrl, options);
        const result = await response.json();

        // Check the structure of the result
        if (!result || !Array.isArray(result.response)) {
          console.error(
            `Unexpected response structure for team_id ${team_id}:`,
            result,
          );
          return [];
        }

        // Attach team_id to each player object in the response
        return result.response.map((player: any) => ({ ...player, team_id }));
      }),
    );

    // Flatten the array of responses into a single array of players
    const allPlayers = responses.flat();

    // Use a Set to keep track of unique player_ids
    const uniquePlayerIds = new Set();
    const formattedPlayers = [];

    for (const player of allPlayers) {
      if (!uniquePlayerIds.has(player.id)) {
        uniquePlayerIds.add(player.id);
        formattedPlayers.push({
          api_id: player.id,
          firstname: player.firstname,
          lastname: player.lastname,
          team_id: player.team_id.toString(),
          leagues: {
            jersey: player.leagues?.standard?.jersey ?? 0, // Default to 0 if not provided
            active: player.leagues?.standard?.active ?? false, // Default to false if not provided
            pos: player.leagues?.standard?.pos ?? "", // Default to empty string if not provided
          },
          birth: {
            date: player.birth?.date ?? "",
            country: player.birth?.country ?? "",
          },
          nba_start: player.nba?.start ?? 0,
          nba_pro: player.nba?.pro ?? 0, // Default to 0 if not provided
          height: {
            feets: player.height?.feets ?? "",
            inches: player.height?.inches ?? "",
            meters: player.height?.meters ?? "",
          },
          weight: {
            pounds: player.weight?.pounds ?? "",
            kilograms: player.weight?.kilograms ?? "",
          },
          college: player.college ?? "",
        });
      }
    }

    console.log(formattedPlayers);
    console.log(`Total unique players: ${formattedPlayers.length}`);

    // Insert into the database
    // const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    // const db = drizzle(sql);
    // await db.insert(players).values(formattedPlayers);
    console.log("Seed done");
  } catch (error) {
    console.error(error);
  }
}

fetchPlayerDataFromAPI();
