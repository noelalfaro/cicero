CREATE TABLE "cicero_scores" (
	"id" integer NOT NULL,
	"cicero_score" numeric NOT NULL,
	"calculated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "examplePlayers" (
	"id" serial PRIMARY KEY NOT NULL,
	"FIRST_NAME" text NOT NULL,
	"LAST_NAME" text NOT NULL,
	"DISPLAY_FIRST_LAST" text NOT NULL,
	"DISPLAY_LAST_COMMA_FIRST" text NOT NULL,
	"DISPLAY_FI_LAST" text NOT NULL,
	"PLAYER_SLUG" text NOT NULL,
	"BIRTHDATE" text NOT NULL,
	"SCHOOL" text NOT NULL,
	"COUNTRY" text NOT NULL,
	"LAST_AFFILIATION" text NOT NULL,
	"HEIGHT" text NOT NULL,
	"WEIGHT" text NOT NULL,
	"SEASON_EXP" integer NOT NULL,
	"JERSEY" text NOT NULL,
	"POSITION" text NOT NULL,
	"ROSTERSTATUS" text NOT NULL,
	"TEAM_ID" integer NOT NULL,
	"TEAM_NAME" text NOT NULL,
	"TEAM_ABBREVIATION" text NOT NULL,
	"TEAM_CODE" text NOT NULL,
	"TEAM_CITY" text NOT NULL,
	"PLAYERCODE" text NOT NULL,
	"FROM_YEAR" integer,
	"TO_YEAR" integer,
	"DLEAGUE_FLAG" text,
	"NBA_FLAG" text,
	"GAMES_PLAYED_FLAG" text,
	"DRAFT_YEAR" text,
	"DRAFT_ROUND" text,
	"DRAFT_NUMBER" text,
	"IS_ACTIVE" text,
	"averages" jsonb
);
--> statement-breakpoint
CREATE TABLE "player_averages" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"fga" real NOT NULL,
	"fgm" real NOT NULL,
	"fgp" real NOT NULL,
	"fta" real NOT NULL,
	"ftm" real NOT NULL,
	"ftp" real NOT NULL,
	"ppg" real NOT NULL,
	"tpa" real NOT NULL,
	"tpm" real NOT NULL,
	"tpp" real NOT NULL,
	"blocks" real NOT NULL,
	"defReb" real NOT NULL,
	"offReb" real NOT NULL,
	"pFouls" real NOT NULL,
	"steals" real NOT NULL,
	"totReb" real NOT NULL,
	"assists" real NOT NULL,
	"minutes" text NOT NULL,
	"plusMinus" text NOT NULL,
	"turnovers" real NOT NULL,
	"last_update" timestamp
);
--> statement-breakpoint
CREATE TABLE "player_stats" (
	"stats_id" serial PRIMARY KEY NOT NULL,
	"player_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	"points" integer NOT NULL,
	"min" text NOT NULL,
	"fgm" integer NOT NULL,
	"fga" integer NOT NULL,
	"fgp" text NOT NULL,
	"ftm" integer NOT NULL,
	"fta" integer NOT NULL,
	"ftp" text NOT NULL,
	"tpm" integer NOT NULL,
	"tpa" integer NOT NULL,
	"tpp" text NOT NULL,
	"offReb" integer NOT NULL,
	"defReb" integer NOT NULL,
	"totReb" integer NOT NULL,
	"assists" integer NOT NULL,
	"pFouls" integer NOT NULL,
	"steals" integer NOT NULL,
	"turnovers" integer NOT NULL,
	"blocks" integer NOT NULL,
	"plusMinus" text NOT NULL,
	"last_update" timestamp
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"TEAM_ID" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"abbreviation" text NOT NULL,
	"code" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"year_founded" integer NOT NULL,
	"LAST_UPDATE" date
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"picture" text NOT NULL,
	"display_name" text,
	"onboarding_status" boolean DEFAULT false NOT NULL,
	"social_connection_id" text
);
--> statement-breakpoint
ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verificationToken" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
DROP TABLE "verificationToken" CASCADE;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "FIRST_NAME" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "LAST_NAME" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DISPLAY_FIRST_LAST" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DISPLAY_LAST_COMMA_FIRST" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DISPLAY_FI_LAST" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "PLAYER_SLUG" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "BIRTHDATE" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "SCHOOL" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "COUNTRY" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "LAST_AFFILIATION" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "HEIGHT" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "WEIGHT" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "SEASON_EXP" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "JERSEY" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "POSITION" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "ROSTERSTATUS" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TEAM_ID" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TEAM_NAME" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TEAM_ABBREVIATION" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TEAM_CODE" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TEAM_CITY" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "PLAYERCODE" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "FROM_YEAR" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "TO_YEAR" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DLEAGUE_FLAG" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "NBA_FLAG" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "GAMES_PLAYED_FLAG" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DRAFT_YEAR" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DRAFT_ROUND" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "DRAFT_NUMBER" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "IS_ACTIVE" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "LAST_UPDATE" timestamp;--> statement-breakpoint
ALTER TABLE "cicero_scores" ADD CONSTRAINT "cicero_scores_id_players_id_fk" FOREIGN KEY ("id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examplePlayers" ADD CONSTRAINT "examplePlayers_TEAM_ID_teams_TEAM_ID_fk" FOREIGN KEY ("TEAM_ID") REFERENCES "public"."teams"("TEAM_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_averages" ADD CONSTRAINT "player_averages_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_stats" ADD CONSTRAINT "player_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_TEAM_ID_teams_TEAM_ID_fk" FOREIGN KEY ("TEAM_ID") REFERENCES "public"."teams"("TEAM_ID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "family_name";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "given_name";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "stats";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN "hometown";