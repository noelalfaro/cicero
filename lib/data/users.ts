import 'server-only';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { User } from '@/lib/definitions';
import { db } from '@/server/db';

export async function createUser(user: User): Promise<string> {
  await db.insert(users).values({ ...user });
  return 'Successfully inserted user to user database';
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
  // console.log(existingUser);

  return existingUser[0];
}

export async function updateUserDisplayName(userId: string, username: string) {
  await db
    .update(users)
    .set({ username: username, display_name: username })
    .where(eq(users.id, userId));
  const updatedUser = await db
    .select({ display_name: users.display_name, id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (
    'Successfully updated display name: ' +
    updatedUser[0]?.display_name +
    ' - For user: ' +
    updatedUser[0]?.id
  );
}

export async function updateUserUsername(userId: string, username: string) {
  await db
    .update(users)
    .set({ username: username })
    .where(eq(users.id, userId));

  const updatedUser = await db
    .select({ username: users.username, id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (
    'Successfully updated username: ' +
    updatedUser[0]?.username +
    ' - For user: ' +
    updatedUser[0]?.id
  );
}

export async function updateUserOnboardingStatus(
  userId: string,
  onboarding_status: boolean,
) {
  await db
    .update(users)
    .set({ onboarding_status: onboarding_status })
    .where(eq(users.id, userId));
}

export async function fetchUserConnectionId(
  userId: string,
): Promise<string | null> {
  const connection_id = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  return connection_id[0].social_connection_id;
}

export async function getCiceroUser(userId: string): Promise<User> {
  const result = await db.select().from(users).where(eq(users.id, userId));
  return result[0];
}
