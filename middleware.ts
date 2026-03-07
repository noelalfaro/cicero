import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextResponse } from 'next/server';
import { KindeRequest } from '@/lib/types';

export default withAuth(
  async function middleware(req: KindeRequest) {
    const kindeSession = req.kindeAuth;
    const { pathname } = req.nextUrl;
    const onboardingPagePath = '/onboarding';

    // API routes and pages essential for authenticated users
    // during the onboarding process or for basic auth actions.
    // These paths are protected by withAuth (user must be logged in),
    // but our custom onboarding redirect logic will NOT apply to them.
    const alwaysAllowedForAuthenticated = [
      '/api/auth/logout',
      '/api/auth/success', // Critical: Kinde redirects here after auth; user sync happens here
      '/api/users/complete-onboarding', // Called by onboarding form
      '/api/users/check-username-availability', // Called by onboarding form
      '/api/users/update-onboarding-status', // Handles both DB and Kinde updates
      '/api/search',
    ];

    // Early return for authenticated users accessing always-allowed paths
    if (kindeSession?.user && kindeSession?.token) {
      if (alwaysAllowedForAuthenticated.includes(pathname)) {
        return NextResponse.next();
      }

      // Check onboarding status from Kinde token claims for all other protected routes
      const onboardingPropertyValue =
        kindeSession.token.user_properties?.onboarding_completed?.v;

      let onboardingCompleted = false;
      if (typeof onboardingPropertyValue === 'string') {
        onboardingCompleted = onboardingPropertyValue.toLowerCase() === 'true';
      } else if (typeof onboardingPropertyValue === 'boolean') {
        onboardingCompleted = onboardingPropertyValue;
      }

      // Scenario 1: User IS ONBOARDED and tries to access the onboarding page
      if (onboardingCompleted && pathname === onboardingPagePath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Scenario 2: User IS NOT ONBOARDED and tries to access a protected page
      if (!onboardingCompleted && pathname !== onboardingPagePath) {
        return NextResponse.redirect(new URL(onboardingPagePath, req.url));
      }

      return NextResponse.next();
    }

    // No valid Kinde session - withAuth will handle redirecting to login
    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
    loginPage: '/login',
    publicPaths: [
      '/',
      '/register',
      '/login',
      '/about-us',
      '/learn',
      '/blog',
      '/demo-login',
      '/api/auth/login',
      '/api/auth/register',
      '/api/uploadthing',
      '/api/auth/kinde_callback',
      '/api/users/check-email-availability',
      '/api/search',
      '/error',
    ],
  },
);

export const config = {
  matcher: [
    '/((?!_next|api/auth/health|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
