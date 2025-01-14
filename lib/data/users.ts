import 'server-only';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { User } from '@/lib/definitions';
import { db } from '@/server/db';

export async function createUser(user: User): Promise<string> {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  if (!existingUser[0]) {
    const result = await db.insert(users).values(user);
    console.log(result);
    return 'Successfully inserted user to user database';
  } else {
    return 'User already in database';
  }
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

export async function updateUserUsername(userId: string, username: string) {
  await db
    .update(users)
    .set({ username: username, display_name: username })
    .where(eq(users.id, userId));
}
