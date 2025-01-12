CREATE TABLE IF NOT EXISTS "players" (
	"id" serial NOT NULL,
	"name" text NOT NULL,
	"stats" json,
	"position" text NOT NULL,
	"hometown" text
);
