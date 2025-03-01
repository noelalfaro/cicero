import { serial, text, integer, pgTable, date } from 'drizzle-orm/pg-core';
import { teams } from '@/server/db/schema/teams';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  first_name: text('FIRST_NAME').notNull(),
  last_name: text('LAST_NAME').notNull(),
  display_first_last: text('DISPLAY_FIRST_LAST').notNull(),
  display_last_comma_first: text('DISPLAY_LAST_COMMA_FIRST').notNull(),
  display_fi_last: text('DISPLAY_FI_LAST').notNull(),
  player_slug: text('PLAYER_SLUG').notNull(),
  birthdate: text('BIRTHDATE').notNull(),
  school: text('SCHOOL').notNull(),
  country: text('COUNTRY').notNull(),
  last_affiliation: text('LAST_AFFILIATION').notNull(),
  height: text('HEIGHT').notNull(),
  weight: text('WEIGHT').notNull(),
  season_exp: integer('SEASON_EXP').notNull(),
  jersey: text('JERSEY').notNull(),
  position: text('POSITION').notNull(),
  rosterstatus: text('ROSTERSTATUS').notNull(),
  team_id: integer('TEAM_ID')
    .references(() => teams.team_id)
    .notNull(),
  team_name: text('TEAM_NAME')
    // .references(() => teams.name)
    .notNull(),
  team_abbreviation: text('TEAM_ABBREVIATION')
    // .references(() => teams.abbreviation)
    .notNull(),
  team_code: text('TEAM_CODE')
    // .references(() => teams.code)
    .notNull(),
  team_city: text('TEAM_CITY')
    // .references(() => teams.city)
    .notNull(),
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
  last_update: date('LAST_UPDATE'),
});
