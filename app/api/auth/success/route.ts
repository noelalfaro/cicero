import { users } from '@/db/schema/users';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { ExtendedKindeIdToken } from '@/app/lib/types';
import { User } from '@/app/lib/definitions';
import { createUser } from '@/app/lib/data';

export async function GET(request: Request) {
  // check if user exists

  // console.log(request.url);
  // const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
  // const db = drizzle(sql);
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log('user' + JSON.stringify(user, null, 2));

  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app/dashboard'
      : 'http://localhost:3000/dashboard';

  const { isAuthenticated, getIdToken } = getKindeServerSession();

  if (await isAuthenticated()) {
    const rawUser = await getIdToken();

    const idToken = (await getIdToken()) as ExtendedKindeIdToken;
    // console.log('middleware: ');
    console.log('ID Token: ' + JSON.stringify(rawUser, null, 2));

    if (idToken) {
      const user: User = {
        family_name: idToken.family_name,
        given_name: idToken.given_name,
        username: idToken.preferred_username,
        picture: idToken.picture,
        email: idToken.email,
        id: idToken.sub,
        display_name: idToken.preferred_username,
      };

      // Call the createUser function directly
      const result = await createUser(user);
      // console.log(result);
    }
  }

  return redirect(redirectURL);
}

// Allowed callback URLs
// https://cicero-coral.vercel.app/api/auth/kinde_callback
// Allowed logout redirect URLs
// https://cicero-coral.vercel.app
