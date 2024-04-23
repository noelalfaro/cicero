ALTER TABLE "players" ADD COLUMN "family_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "given_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "players" DROP COLUMN IF EXISTS "name";