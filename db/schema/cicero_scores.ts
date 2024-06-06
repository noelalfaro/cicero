import {
  serial,
  integer,
  numeric,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";
import { players } from "@/db/schema/players";

export const ciceroScores = pgTable("cicero_scores", {
  id: serial("id").primaryKey(),
  player_id: integer("id")
    .notNull()
    .references(() => players.id),
  cicero_score: numeric("cicero_score").notNull(),
  calculated_at: timestamp("calculated_at").defaultNow(),
});
