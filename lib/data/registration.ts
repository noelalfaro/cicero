'use server';
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export async function checkIfUsernameIsInBlacklist(username: string) {
  return !matcher.hasMatch(username);
}

export async function checkUsernameAvailability(
  username: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result.length === 0;
}
