import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUser } from '@/app/lib/data'; // Adjust the path as needed
import { ExtendedKindeIdToken } from '@/app/lib/types';
import { User } from '@/app/lib/definitions';

async function customMiddleware(request: NextRequest) {
  const response = await withAuth(request);

  return response;
}

export function middleware(request: NextRequest) {
  return customMiddleware(request);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/notifications', '/explore'],
};
