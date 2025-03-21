import {
  serial,
  integer,
  pgTable,
  text,
  timestamp,
  real,
} from 'drizzle-orm/pg-core';
import { players } from '@/server/db/schema/players';
import { sql } from 'drizzle-orm';

// import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";

export const playerStats = pgTable('player_stats', {
  stats_id: serial('stats_id').primaryKey(),
  player_id: integer('player_id')
    .references(() => players.id)
    .notNull(),
  game_id: text('game_id').notNull(),
  points: integer('points').notNull(),
  min: text('min').notNull(),
  fgm: integer('fgm').notNull(),
  fga: integer('fga').notNull(),
  fgp: real('fgp').notNull(),
  ftm: integer('ftm').notNull(),
  fta: integer('fta').notNull(),
  ftp: real('ftp').notNull(),
  tpm: integer('tpm').notNull(),
  tpa: integer('tpa').notNull(),
  tpp: real('tpp').notNull(),
  offReb: integer('offReb').notNull(),
  defReb: integer('defReb').notNull(),
  totReb: integer('totReb').notNull(),
  assists: integer('assists').notNull(),
  pFouls: integer('pFouls').notNull(),
  steals: integer('steals').notNull(),
  turnovers: integer('turnovers').notNull(),
  blocks: integer('blocks').notNull(),
  comment: text('comment'),
  plusMinus: text('plusMinus').notNull(),
  gamedate: timestamp('gamedate')
    .notNull()
    .default(new Date(new Date().getFullYear(), 0, 1)),
  created_at: timestamp('created_at')
    .default(sql`now()`)
    .notNull(),
});
