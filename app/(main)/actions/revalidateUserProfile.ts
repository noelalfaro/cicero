// app/(main)/actions/revalidateUserProfile.ts
// (This might be the file you had commented out for revalidateUserProfile)
'use server'; // Important: This is a Server Action

import { revalidatePath } from 'next/cache';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'; // Needed to check user context if revalidating user-specific data

export async function revalidateUserProfile() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    // Or throw an error, depending on desired behavior
    console.error(
      'Attempted to revalidate user profile without a logged-in user.',
    );
    return;
  }

  // Assuming the user's profile data is fetched on '/dashboard' or similar paths
  // and relies on Kinde/DB data. Revalidate the path where the user data is displayed.
  revalidatePath('/dashboard'); // Or the path where your user component is rendered
  // You might also need to revalidate the path of the current page if it uses the user data
  // revalidatePath('/settings/profile'); // Example path if user is on a profile settings page
  console.log(`Revalidated user profile for ${user.id}`);
}
