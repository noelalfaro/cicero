import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
// import { db, connection } from './db';
import { db } from '@/server/db';

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './drizzle' });
