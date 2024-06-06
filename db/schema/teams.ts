import { text, pgTable, integer } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  team_id: integer("team_id").primaryKey(),
  full_name: text("name").notNull(),
  logo: text("logo").notNull(),
  abbreviation: text("abbreviation").notNull(),
  nickname: text("nickname").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  year_founded: integer("year_founded").notNull(),
});
