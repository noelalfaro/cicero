CREATE TABLE "transactions" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	"transaction_type" text NOT NULL,
	"price" real NOT NULL,
	"quantity" integer NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"stats_id" integer
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_stats_id_player_stats_stats_id_fk" FOREIGN KEY ("stats_id") REFERENCES "public"."player_stats"("stats_id") ON DELETE no action ON UPDATE no action;