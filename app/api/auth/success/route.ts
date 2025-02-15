import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { User } from '@/lib/definitions';
import { createUser, getUserById, updateUser } from '@/lib/data/users';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { getIdToken } = getKindeServerSession();

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app'
      : 'http://localhost:3000';

  try {
    const idToken = await getIdToken();
    // console.log(idToken);
    const userId = idToken.sub;
    const existingUser = await getUserById(userId);

    if (existingUser) {
      // Check the onboarding status
      if (!existingUser.onboarding_status) {
        // Redirect user to the onboarding process
        console.log("user's onboarding status is false");
        return NextResponse.redirect(`${redirectURL}/onboarding`);
      } else {
        // User exists and has completed onboarding, proceed with login
        // console.log('Existing User logged in:', existingUser);
      }

      // if (!existingUser.social_connection_id) {
      //   // Update the user's social_connection_id
      //   await updateUser({
      //     ...existingUser,
      //     social_connection_id: idToken.ext_provider?.name ?? null,
      //   });

      //   return NextResponse.redirect(`${redirectURL}/dashboard`);
      // }
    } else {
      // User does not exist, proceed with registration
      const user: User = {
        username: null, // Keep username null initially
        id: idToken.sub,
        email: idToken.email ?? '',
        picture:
          idToken.picture ??
          'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg',

        display_name: idToken.name ?? null,
        onboarding_status: false,
        social_connection_id: idToken.ext_provider?.name ?? null,
      };

      await createUser(user);

      // Redirect user to a page to fill in the username
      return NextResponse.redirect(`${redirectURL}/onboarding`);
    }
  } catch (error) {
    console.error('Error during authentication:', error);
  }

  // return NextResponse.redirect(new URL('/dashboard', redirectURL));
  return NextResponse.redirect(`${redirectURL}/dashboard`);
}
