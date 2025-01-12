'use server';
import { users } from '@/server/db/schema/users';
import { updateUserFormSchema } from '@/lib/definitions'; // Adjust this import if necessary
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export async function updateUserProfile(formData: FormData) {
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  const db = drizzle(sql);

  const data = {
    id: formData.get('id'),
    display_name: formData.get('display_name'),
  };

  const userData = updateUserFormSchema.parse(data);
  // console.log('from the server:', JSON.stringify(userData, null, 2));

  try {
    const updatedUsers = await db
      .update(users)
      .set({
        display_name: userData.display_name,
        // Add other fields as necessary
      })
      .where(eq(users.id, userData.id))
      .returning();

    if (updatedUsers.length === 0) {
      throw new Error('User not found');
    }
    revalidatePath('/');
    return updatedUsers[0];
    // redirect(`/${updatedUsers[0].username}`);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error; // Or handle the error as appropriate for your application
  }
}
