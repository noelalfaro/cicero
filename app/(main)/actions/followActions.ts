'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { followUser, unfollowUser } from '@/lib/data/follows';

export async function follow(followeeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');
  if (session.user.id === followeeId) throw new Error('Cannot follow yourself');

  await followUser(session.user.id, followeeId);
  revalidatePath(`/users`);
}

export async function unfollow(followeeId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');

  await unfollowUser(session.user.id, followeeId);
  revalidatePath(`/users`);
}
