import {
  serial,
  integer,
  pgTable,
  foreignKey,
  text,
} from 'drizzle-orm/pg-core';
import { players } from '@/db/schema/players';

// import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";

export const playerStats = pgTable('player_stats', {
  stat_id: serial('stat_id').primaryKey(),
  player_id: integer('player_id')
    .references(() => players.id)
    .notNull(),
  game_id: integer('game_id').notNull(),
  points: integer('points').notNull(),
  min: text('min').notNull(),
  fgm: integer('fgm').notNull(),
  fga: integer('fga').notNull(),
  fgp: text('fgp').notNull(),
  ftm: integer('ftm').notNull(),
  fta: integer('fta').notNull(),
  ftp: text('ftp').notNull(),
  tpm: integer('tpm').notNull(),
  tpa: integer('tpa').notNull(),
  tpp: text('tpp').notNull(),
  offReb: integer('offReb').notNull(),
  defReb: integer('defReb').notNull(),
  totReb: integer('totReb').notNull(),
  assists: integer('assists').notNull(),
  pFouls: integer('pFouls').notNull(),
  steals: integer('steals').notNull(),
  turnovers: integer('turnovers').notNull(),
  blocks: integer('blocks').notNull(),
  plusMinus: text('plusMinus').notNull(),
});
