import { text, pgTable, integer } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  team_id: integer("TEAM_ID").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  abbreviation: text("abbreviation").notNull(),
  code: text("code").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  year_founded: integer("year_founded").notNull(),
});
