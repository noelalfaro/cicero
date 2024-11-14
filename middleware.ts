import { NextResponse, type NextRequest } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

// async function customMiddleware(request: NextRequest) {
//   const response = await withAuth(request);

//   return response;
// }

// export function middleware(request: NextRequest) {
//   return customMiddleware(request);
// }

export async function middleware(request: NextRequest) {
  const authRequest = await withAuth(request, {
    isReturnToCurrentPage: true,
    loginPage: '/',
  });

  // If withAuth returns a response, it means authentication failed
  if (authRequest instanceof Response) return authRequest;

  // Add any custom logic here
  // For example, you can add headers or modify the request

  // If no issues, continue to the next middleware or route handler
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard',
    '/notifications',
    '/explore',
    '/players/:path*',
    '/:username',
  ],
};
