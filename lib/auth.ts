import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { sessions, accounts, verifications } from '@/server/db/schema/auth';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    fields: {
      name: 'display_name',
      image: 'picture',
    },
    additionalFields: {
      username: { type: 'string', required: false, input: false },
      onboarding_status: {
        type: 'boolean',
        required: true,
        defaultValue: false,
        input: false,
      },
      hometown: { type: 'string', required: false, input: false },
      favorite_team: { type: 'string', required: false, input: false },
      goat: { type: 'string', required: false, input: false },
      social_platform: { type: 'string', required: false, input: false },
      social_handle: { type: 'string', required: false, input: false },
      age: { type: 'number', required: false, input: false },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
