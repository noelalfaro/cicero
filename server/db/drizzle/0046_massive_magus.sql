ALTER TABLE "player_stats" ALTER COLUMN "fgp" SET DATA TYPE REAL USING (fgp::real);--> statement-breakpoint
ALTER TABLE "player_stats" ALTER COLUMN "ftp" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "player_stats" ALTER COLUMN "tpp" SET DATA TYPE real;
