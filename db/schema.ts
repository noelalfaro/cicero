import { serial, text, timestamp, pgTable, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
export const players = pgTable("players", {
  id: serial("id"),
  name: text("name").notNull(),
  stats: json("stats"),
  position: text("position").notNull(),
  hometown: text("hometown"),
});
