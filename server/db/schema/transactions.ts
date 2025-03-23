import {
  serial,
  integer,
  pgTable,
  timestamp,
  text,
  primaryKey,
  real,
} from 'drizzle-orm/pg-core';
import { users } from './users'; // Assuming you have a users table
import { players } from './players'; // Assuming you have a players table
import { playerStats } from './player_stats';

export const transactions = pgTable('transactions', {
  transaction_id: serial('transaction_id').primaryKey(),
  user_id: text('user_id')
    .references(() => users.id)
    .notNull(),
  player_id: integer('player_id')
    .references(() => players.id)
    .notNull(),
  transaction_type: text('transaction_type', {
    enum: ['buy', 'sell'],
  }).notNull(),
  price: real('price').notNull(), // Use real for prScore, you can use integer or decimal as well
  quantity: integer('quantity').notNull(),
  transaction_date: timestamp('transaction_date').defaultNow().notNull(),
  stats_id: integer('stats_id').references(() => playerStats.stats_id),
});
