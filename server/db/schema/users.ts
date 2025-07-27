import { pgTable, text, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  username: text('username'),
  email: text('email').notNull(),
  picture: text('picture'),
  display_name: text('display_name'),
  onboarding_status: boolean('onboarding_status').notNull().default(false),
  social_connection_id: text('social_connection_id'),
  hometown: text('hometown'),
  favorite_team: text('favorite_team'),
  goat: text('goat'),
  social_platform: text('social_platform', {
    enum: ['X (Twitter)', 'Threads', 'Bluesky'],
  }),
  social_handle: text('social_handle'),
  age: integer('age'),
});
