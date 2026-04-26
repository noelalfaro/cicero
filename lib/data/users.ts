import 'server-only';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { User } from '@/lib/definitions';
import { db } from '@/server/db';

export async function createUser(user: User) {
  try {
    const result = await db.insert(users).values(user).returning();
    return result;
  } catch (error) {
    console.error('ERROR in createUser:', error);
    throw error;
  }
}

export async function updateUser(user: User): Promise<string> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  if (existingUser[0]) {
    await db.update(users).set(user).where(eq(users.id, user.id));
    return 'Successfully updated user';
  } else {
    return 'User not found';
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return existingUser[0];
}

export async function fetchUserDataByUsername(username: string): Promise<User> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return existingUser[0];
}

export async function fetchUserDataById(id: string): Promise<User | null> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!existingUser) return null;

  return existingUser[0];
}

export interface OnboardingData {
  username: string;
  hometown?: string | null;
  favorite_team?: string | null;
  goat?: string | null;
  picture?: string | null;
  social_platform?: 'X (Twitter)' | 'Threads' | 'BlueSky' | null;
  social_handle?: string | null;
  age?: number | null;
}

export async function completeOnboardingUpdate(
  userId: string,
  data: OnboardingData,
) {
  const result = await db
    .update(users)
    .set({
      username: data.username,
      display_name: data.username,
      hometown: data.hometown,
      favorite_team: data.favorite_team,
      goat: data.goat,
      picture: data.picture,
      social_platform: data.social_platform,
      social_handle: data.social_handle,
      age: data.age,
      onboarding_status: true,
    })
    .where(eq(users.id, userId))
    .returning({ updatedId: users.id });

  if (result.length === 0) {
    throw new Error(`User with ID ${userId} not found for update.`);
  }

  return result[0];
}

export async function getCiceroUser(userId: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, userId));
  return result[0];
}
