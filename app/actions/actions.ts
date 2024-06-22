'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateUserProfile() {
  revalidatePath('/'); // Adjust the path as needed
}
