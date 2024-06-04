import {
  serial,
  text,
  integer,
  pgTable,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  player_id: serial("player_id").primaryKey(),
  api_id: integer("api_id").notNull(),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  team_id: text("team_id").notNull(), // Assuming team_id is a string
  leagues: jsonb("leagues").notNull(), // Storing leagues as JSONB
  height: jsonb("height").notNull(), // Storing height as JSONB
  weight: jsonb("weight").notNull(), // Storing weight as JSONB
  birth: jsonb("birth").notNull(), // Storing birth as JSONB
  nba_start: integer("nba_start").notNull(),
  nba_pro: integer("nba_pro").notNull(),
  college: text("college"),
});
