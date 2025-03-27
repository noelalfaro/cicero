ALTER TABLE "player_stats" ALTER COLUMN "gamedate" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "player_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "player_stats" ADD COLUMN "season" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "player_stats" ADD COLUMN "game_result" text;