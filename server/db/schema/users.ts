import { pgTable, text, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  given_name: text('given_name'),
  family_name: text('family_name'),
  username: text('username'),
  email: text('email').notNull(),
  picture: text('picture').notNull(),
  display_name: text('display_name'),
  onboarding_status: boolean('onboarding_status').notNull().default(false),
  social_connection_id: text('social_connection_id'),
});
