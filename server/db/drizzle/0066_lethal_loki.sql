ALTER TABLE "users" ALTER COLUMN "picture" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");