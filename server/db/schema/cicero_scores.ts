import { integer, numeric, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { players } from '@/server/db/schema/players';

export const ciceroScores = pgTable('cicero_scores', {
  player_id: integer('id')
    .notNull()
    .references(() => players.id),
  cicero_score: numeric('cicero_score').notNull(),
  calculated_at: timestamp('calculated_at').defaultNow(),
});
