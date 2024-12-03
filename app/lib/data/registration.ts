import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity';

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
import { users } from '@/db/schema/users';

import { eq } from 'drizzle-orm';

import { db } from '@/db';

export async function checkIfUsernameIsInBlacklist(username: string) {
  return !matcher.hasMatch(username);
}

export async function doesEmailExistCheck(email: string): Promise<boolean> {
  const result = await db.select().from(users).where(eq(users.email, email));
  console.log(result);
  if (result.length > 0) return true;
  else return false;
}

export async function checkIfUsernameIsTaken(
  username: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return result.length > 0;
}

export async function checkIfEmailIsValid(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  console.log(result);

  if (result.length > 0) return true;

  return false;
}
