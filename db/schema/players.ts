import { serial, text, timestamp, pgTable, json } from "drizzle-orm/pg-core";

export const players = pgTable("players", {
  id: serial("id"),
  name: text("name").notNull(),
  stats: json("stats"),
  position: text("position").notNull(),
  hometown: text("hometown"),
});
