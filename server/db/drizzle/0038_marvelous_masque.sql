ALTER TABLE "player_averages" ADD COLUMN "last_update" timestamp;--> statement-breakpoint
ALTER TABLE "player_stats" ADD COLUMN "last_update" timestamp;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "LAST_UPDATE" timestamp;