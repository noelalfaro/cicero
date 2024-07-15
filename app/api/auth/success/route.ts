import { users } from '@/db/schema/users';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { ExtendedKindeIdToken } from '@/app/lib/types';
import { User } from '@/app/lib/definitions';
import { createUser, updateUserUsername } from '@/app/lib/data';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const username = cookieStore.get('temp_username')?.value;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const defaultUserImageUrl =
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app/dashboard'
      : 'http://localhost:3000/dashboard';

  const { isAuthenticated, getIdToken } = getKindeServerSession();

  if (await isAuthenticated()) {
    const idToken = (await getIdToken()) as ExtendedKindeIdToken;

    if (idToken) {
      const user: User = {
        username:
          idToken.preferred_username ||
          idToken.ext_provider.claims?.profile?.login,
        picture: idToken.picture || defaultUserImageUrl,
        email: idToken.email,
        id: idToken.sub,
        display_name: idToken.name,
      };

      await createUser(user);

      if (username) {
        await updateUserUsername(user.id, username);
      }

      cookieStore.delete('temp_username');
    }
  }

  return redirect(redirectURL);
}

// Allowed callback URLs
// https://cicero-coral.vercel.app/api/auth/kinde_callback
// Allowed logout redirect URLs
// https://cicero-coral.vercel.app
