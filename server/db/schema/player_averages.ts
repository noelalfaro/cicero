import {
  serial,
  text,
  integer,
  pgTable,
  real,
  date,
} from 'drizzle-orm/pg-core';
import { players } from '@/server/db/schema/players';

export const player_averages = pgTable('player_averages', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id')
    .references(() => players.id)
    .notNull(),
  fga: real('fga').notNull(),
  fgm: real('fgm').notNull(),
  fgp: real('fgp').notNull(),
  fta: real('fta').notNull(),
  ftm: real('ftm').notNull(),
  ftp: real('ftp').notNull(),
  ppg: real('ppg').notNull(),
  tpa: real('tpa').notNull(),
  tpm: real('tpm').notNull(),
  tpp: real('tpp').notNull(),
  blocks: real('blocks').notNull(),
  defReb: real('defReb').notNull(),
  offReb: real('offReb').notNull(),
  pFouls: real('pFouls').notNull(),
  steals: real('steals').notNull(),
  totReb: real('totReb').notNull(),
  assists: real('assists').notNull(),
  minutes: text('minutes').notNull(),
  plusMinus: text('plusMinus').notNull(),
  turnovers: real('turnovers').notNull(),
  last_update: date('last_update'),
});
