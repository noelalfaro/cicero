ALTER TABLE "player_stats" ALTER COLUMN "gamedate" SET DEFAULT '2025-01-01 06:00:00.000';--> statement-breakpoint
ALTER TABLE "player_stats" ALTER COLUMN "created_at" SET DEFAULT now();