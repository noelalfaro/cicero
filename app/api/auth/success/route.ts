import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { ExtendedKindeIdToken } from '@/lib/types';
import { User } from '@/lib/definitions';
import { createUser, updateUserUsername } from '@/lib/data/users';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const username = cookieStore.get('temp_username')?.value;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(user);
  const defaultUserImageUrl =
    'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg';

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app/dashboard'
      : 'http://localhost:3000/dashboard';

  const { isAuthenticated, getIdToken } = getKindeServerSession();

  if (await isAuthenticated()) {
    // console.log(await getIdToken());
    const idToken = (await getIdToken()) as unknown as ExtendedKindeIdToken;
    console.log(JSON.stringify(idToken, null, 2));

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
