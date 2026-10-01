'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateUserProfile(username: string) {
  if (!username) return;
  revalidatePath(`/users/${username}`);
}
