import {
  timestamp,
  pgTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  username: text("username"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});
