import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUser } from '@/app/lib/data'; // Adjust the path as needed
import { ExtendedKindeIdToken } from '@/app/lib/types';
import { User } from '@/app/lib/definitions';

async function customMiddleware(request: NextRequest) {
  const response = await withAuth(request);

  const { isAuthenticated, getIdToken } = getKindeServerSession();

  if (await isAuthenticated()) {
    const idToken = (await getIdToken()) as ExtendedKindeIdToken;
    // console.log('middleware: ');
    // console.log(idToken);

    if (idToken) {
      const user: User = {
        family_name: idToken.family_name,
        given_name: idToken.given_name,
        username: idToken.preferred_username,
        picture: idToken.picture,
        email: idToken.email,
        id: idToken.sub,
      };

      // Call the createUser function directly
      const result = await createUser(user);
      console.log(result);
    }
  }

  return response;
}

export function middleware(request: NextRequest) {
  return customMiddleware(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/notifications', '/explore'],
};
