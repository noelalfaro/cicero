import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "./schema/players";
import { players_data_api } from "../app/lib/player_api_data";
// import { players } from "@/db/schema/players";
import { config } from "dotenv";
config({ path: ".env.local" });

const main = async () => {
  try {
    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    const db = drizzle(sql);
    await db.insert(players).values(players_data_api);
    console.log("Seed done");
  } catch (error) {
    console.log("error: " + error);
  }
};

main();
