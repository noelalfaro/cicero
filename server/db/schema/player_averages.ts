import {
  serial,
  text,
  integer,
  pgTable,
  real,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { players } from '@/server/db/schema/players';

export const playerAverages = pgTable(
  'player_averages',
  {
    averages_id: serial('id').primaryKey(),
    player_id: integer('player_id')
      .references(() => players.id)
      .notNull(),
    ppg: real('ppg'),
    apg: real('apg'),
    rpg: real('rpg'),
    last_update: timestamp('last_update'),
  },
  // Add index here
  (table) => [index('idx_playeravg_playerid').on(table.player_id)],
);
