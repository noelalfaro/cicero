import {
  timestamp,
  pgTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  given_name: text('given_name'),
  family_name: text('family_name'),
  username: text('username'),
  email: text('email'),
  picture: text('picture'),
  display_name: text('display_name'),
});
