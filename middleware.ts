import type { NextRequest } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

async function customMiddleware(request: NextRequest) {
  const response = await withAuth(request);

  return response;
}

export function middleware(request: NextRequest) {
  return customMiddleware(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard',
    '/notifications',
    '/explore',
    // '/players/:id*',
    // '/:username*',
  ],
};
