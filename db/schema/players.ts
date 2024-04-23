import { serial, text, timestamp, pgTable, json } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  family_name: text("family_name").notNull().default("NBA"),
  given_name: text("given_name").notNull().default("Player"),
  stats: json("stats"),
  position: text("position").notNull(),
  hometown: text("hometown"),
});
