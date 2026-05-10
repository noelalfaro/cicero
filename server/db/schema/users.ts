import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    display_name: text('display_name'),
    picture: text('picture'),
    username: text('username'),
    onboarding_status: boolean('onboarding_status').notNull().default(false),
    hometown: text('hometown'),
    favorite_team: text('favorite_team'),
    goat: text('goat'),
    social_platform: text('social_platform', {
      enum: ['X (Twitter)', 'Threads', 'BlueSky'],
    }),
    social_handle: text('social_handle'),
    age: integer('age'),
    bio: text('bio'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('users_username_unique').on(table.username)],
);
