ALTER TABLE "player_averages" ALTER COLUMN "ppg" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "player_averages" ADD COLUMN "apg" real;--> statement-breakpoint
ALTER TABLE "player_averages" ADD COLUMN "rpg" real;--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "fga";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "fgm";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "fgp";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "fta";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "ftm";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "ftp";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "tpa";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "tpm";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "tpp";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "blocks";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "defReb";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "offReb";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "pFouls";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "steals";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "totReb";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "assists";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "minutes";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "plusMinus";--> statement-breakpoint
ALTER TABLE "player_averages" DROP COLUMN "turnovers";