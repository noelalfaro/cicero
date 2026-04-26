'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function revalidateUserProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    console.error(
      'Attempted to revalidate user profile without a logged-in user.',
    );
    return;
  }

  revalidatePath('/dashboard');
}
