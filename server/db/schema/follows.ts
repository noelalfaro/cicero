import { pgTable, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';

export const follows = pgTable(
  'follows',
  {
    follower_id: text('follower_id')
      .references(() => users.id)
      .notNull(),
    following_id: text('following_id')
      .references(() => users.id)
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.follower_id, table.following_id] })],
);
