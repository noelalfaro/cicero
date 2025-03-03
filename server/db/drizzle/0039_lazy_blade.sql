ALTER TABLE "player_stats" ADD COLUMN "gamedate" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "player_stats" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "player_stats" DROP COLUMN "last_update";