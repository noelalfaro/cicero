import { text, pgTable, integer } from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  team_id: integer("team_id").primaryKey(),
  name: text("name").notNull(),
  nickname: text("nickname").notNull(),
  code: text("code").notNull(),
  logo: text("logo").notNull(),
  city: text("city").notNull(),
});
