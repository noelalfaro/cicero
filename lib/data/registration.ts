'use server';
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';
import { users } from '@/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/server/db';

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
export async function checkIfUsernameIsInBlacklist(username: string) {
  return !matcher.hasMatch(username);
}

export async function doesEmailExistCheck(email: string): Promise<boolean> {
  const result = await db.select().from(users).where(eq(users.email, email));
  console.log(result);
  if (result.length > 0) return true;
  else return false;
}

export async function checkUsernameAvailability(
  username: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result.length === 0; // Return true if the username is not found (available), false otherwise
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result.length === 0;
}
