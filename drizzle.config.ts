import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env.local' });

export default {
  schema: './server/db/schema/*.ts',
  out: './server/db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL!,
  },
  strict: true,
} satisfies Config;
