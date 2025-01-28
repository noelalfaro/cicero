import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ExtendedKindeIdToken } from '@/lib/types';
import { User } from '@/lib/definitions';
import { createUser, getUserById } from '@/lib/data/users';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { isAuthenticated, getIdToken, getAccessToken } =
    getKindeServerSession();
  const cookieStore = cookies();
  const tempUsername = (await cookieStore).get('temp_username')?.value;

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app/dashboard'
      : 'http://localhost:3000/dashboard';

  if (await isAuthenticated()) {
    try {
      const idToken = (await getIdToken()) as ExtendedKindeIdToken;
      const accessToken = await getAccessToken();

      if (idToken && accessToken) {
        const userId = idToken.sub;
        const existingUser = await getUserById(userId);

        if (existingUser) {
          // Check the onboarding status
          if (!existingUser.onboarding_status) {
            // Redirect user to the onboarding process
            console.log("user's onboarding status is false");
            return NextResponse.redirect(new URL('/onboarding', redirectURL));
          } else {
            // User exists and has completed onboarding, proceed with login
            console.log('Existing User logged in:', existingUser);
          }
        } else {
          // User does not exist, proceed with registration
          const user: User = {
            username: null, // Keep username null initially
            picture:
              idToken.picture ??
              'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg',
            email: idToken.email ?? '',
            id: idToken.sub,
            display_name: idToken.name ?? null,
            onboarding_status: false,
          };

          await createUser(user);

          // Redirect user to a page to fill in the username
          return NextResponse.redirect(new URL('/onboarding', redirectURL));
        }

        (await cookieStore).delete('temp_username');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  }

  return NextResponse.redirect(new URL('/dashboard', redirectURL));
}
