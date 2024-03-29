// import { players } from "./schema/players";
// import { players_data } from "../app/lib/placeholder-data";
// import { drizzle } from "drizzle-orm/vercel-postgres";
// import * as dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
// import { sql } from "@vercel/postgres";

// const main = async () => {
//   try {
//     const db = drizzle(sql); // Create a Drizzle connection instance

//     // ... Your seeding logic with db.insert(...)
//     await db.insert(players).values(players_data);

//     console.log("Seed done");
//   } catch (error) {
//     console.log(error);
//   }
// };

// main();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { players } from "./schema/players";
import { players_data } from "../app/lib/placeholder-data";
import { config } from "dotenv";
config({ path: ".env" });

const main = async () => {
  try {
    const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    const db = drizzle(sql);
    await db.insert(players).values(players_data);
    console.log("Seed done");
  } catch (error) {
    console.log("error: " + error);
  }
};

main();
