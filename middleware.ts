import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req: NextRequest) {
    // console.log('Middleware called');
    // TODO: Add a logic check to verify if the user has completed onboarding, if not we redirect them to the onboarding page. To complete onboarding, the user must have a username.
    // console.log(req);

    const user = req;
    console.log(user);
  },
  {
    isReturnToCurrentPage: true,
    loginPage: '/login',
    publicPaths: [
      '/register',
      '/login',
      '/about-us',
      '/learn',
      '/api/auth/register',
      '/api/auth/login',
      '/api/users/',
      '/',
      '/blog/*',
      '/api/uploadthing',
    ],
  },
);

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
