// Combine-owned tables — read-only for Courtside.
// Bryan Diaz (bddiaz/cicero-scripts) owns migrations for these via Alembic.
// Do NOT include this file in drizzle.config.ts schema list.

import {
  serial,
  text,
  integer,
  pgTable,
  timestamp,
  boolean,
  real,
  numeric,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const teams = pgTable('teams', {
  team_id: integer('TEAM_ID').primaryKey(),
  name: text('name').notNull(),
  logo: text('logo').notNull(),
  abbreviation: text('abbreviation').notNull(),
  code: text('code').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  year_founded: integer('year_founded').notNull(),
  last_update: text('LAST_UPDATE'),
});

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  first_name: text('FIRST_NAME').notNull(),
  last_name: text('LAST_NAME').notNull(),
  display_first_last: text('DISPLAY_FIRST_LAST').notNull(),
  display_last_comma_first: text('DISPLAY_LAST_COMMA_FIRST').notNull(),
  display_fi_last: text('DISPLAY_FI_LAST').notNull(),
  player_slug: text('PLAYER_SLUG').notNull(),
  birthdate: text('BIRTHDATE').notNull(),
  school: text('SCHOOL'),
  country: text('COUNTRY').notNull(),
  last_affiliation: text('LAST_AFFILIATION'),
  height: text('HEIGHT').notNull(),
  weight: text('WEIGHT').notNull(),
  season_exp: integer('SEASON_EXP').notNull(),
  jersey: text('JERSEY').notNull(),
  position: text('POSITION').notNull(),
  rosterstatus: text('ROSTERSTATUS').notNull(),
  team_id: integer('TEAM_ID')
    .references(() => teams.team_id)
    .notNull(),
  team_name: text('TEAM_NAME').notNull(),
  team_abbreviation: text('TEAM_ABBREVIATION').notNull(),
  team_code: text('TEAM_CODE').notNull(),
  team_city: text('TEAM_CITY').notNull(),
  playercode: text('PLAYERCODE').notNull(),
  from_year: integer('FROM_YEAR'),
  to_year: integer('TO_YEAR'),
  dleague_flag: text('DLEAGUE_FLAG'),
  nba_flag: text('NBA_FLAG'),
  games_played_flag: text('GAMES_PLAYED_FLAG'),
  draft_year: text('DRAFT_YEAR'),
  draft_round: text('DRAFT_ROUND'),
  draft_number: text('DRAFT_NUMBER'),
  is_active: text('IS_ACTIVE'),
  is_retired: boolean('IS_RETIRED'),
  last_updated: timestamp('LAST_UPDATED'),
});

export const playerStats = pgTable(
  'player_stats',
  {
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
    season: integer('season').notNull(),
    game_result: text('game_result'),
    prScore: real('prScore'),
    opp: text('opp'),
    gamedate: timestamp('gamedate').notNull(),
    is_mock: boolean('is_mock').default(false),
    created_at: timestamp('created_at')
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    index('idx_playerstats_playerid_gamedate').on(
      table.player_id,
      table.gamedate,
    ),
  ],
);

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
  (table) => [index('idx_playeravg_playerid').on(table.player_id)],
);

export const ciceroScores = pgTable('cicero_scores', {
  player_id: integer('id')
    .notNull()
    .references(() => players.id),
  cicero_score: numeric('cicero_score').notNull(),
  calculated_at: timestamp('calculated_at').defaultNow(),
});
