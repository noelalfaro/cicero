// import { boolean } from "drizzle-orm/mysql-core";
import { serial, text, integer, pgTable, boolean } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  player_id: serial("player_id").primaryKey(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  birth_date: text("birth_date").notNull(), // Assuming date as text, adjust if needed
  birth_country: text("birth_country").notNull(),
  nba_start: integer("nba_start").notNull(),
  nba_pro: integer("nba_pro").notNull(),
  height_feet: integer("height_feet").notNull(),
  height_inches: integer("height_inches").notNull(),
  height_meters: text("height_meters").notNull(), // Assuming meters as text, adjust if needed
  weight_pounds: integer("weight_pounds").notNull(),
  weight_kilograms: text("weight_kilograms").notNull(), // Assuming kilograms as text, adjust if needed
  college: text("college").notNull(),
  affiliation: text("affiliation").notNull(),
  jersey: integer("jersey").notNull(),
  active: boolean("active").notNull(), // Assuming active as text, adjust if needed
  position: text("position").notNull(),
});
