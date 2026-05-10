'use server';
import { db } from '@/server/db';
import { users } from '@/server/db/schema/users';
import { updateUserFormSchema } from '@/lib/definitions';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateUserProfile(formData: FormData) {
  const data = {
    id: formData.get('id') as string,
    display_name: formData.get('display_name') as string,
    picture: formData.get('picture') ? String(formData.get('picture')) : undefined,
    bio: formData.get('bio') ? String(formData.get('bio')) : null,
  };

  const userData = updateUserFormSchema.parse(data);

  try {
    const updatedUsers = await db
      .update(users)
      .set({
        display_name: userData.display_name,
        picture: userData.picture,
        bio: userData.bio,
      })
      .where(eq(users.id, userData.id))
      .returning();

    if (updatedUsers.length === 0) {
      throw new Error('User not found');
    }

    revalidatePath('/');
    return updatedUsers[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
