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
      '/api/users/update-onboarding-status', // Your existing endpoint - handles both DB and Kinde updates
    ];

    // Early return for authenticated users accessing always-allowed paths
    if (kindeSession?.user && kindeSession?.token) {
      if (alwaysAllowedForAuthenticated.includes(pathname)) {
        console.log(`Middleware: Allowing authenticated access to ${pathname}`);
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

      console.log(
        `Middleware: User ${kindeSession.user.id} - Onboarding status: ${onboardingCompleted} for path: ${pathname}`,
      );

      // Scenario 1: User IS ONBOARDED and tries to access the onboarding page
      if (onboardingCompleted && pathname === onboardingPagePath) {
        console.log(
          `Middleware: User ${kindeSession.user.id} is already onboarded. Redirecting from /onboarding to /dashboard`,
        );
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Scenario 2: User IS NOT ONBOARDED and tries to access a protected page
      // (excluding the onboarding page itself and always-allowed paths)
      if (!onboardingCompleted && pathname !== onboardingPagePath) {
        console.log(
          `Middleware: User ${kindeSession.user.id} not onboarded. Redirecting to /onboarding from ${pathname}`,
        );
        return NextResponse.redirect(new URL(onboardingPagePath, req.url));
      }

      // Allow the request to proceed if:
      // - Onboarded user accessing any protected route
      // - Non-onboarded user accessing the onboarding page
      console.log(`Middleware: Allowing access to ${pathname}`);
      return NextResponse.next();
    }

    // No valid Kinde session - withAuth will handle redirecting to login
    console.log(
      `Middleware: No valid session for ${pathname} - withAuth will handle redirect`,
    );
    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
    loginPage: '/login',
    publicPaths: [
      '/', // Landing page
      '/register', // Registration page
      '/login', // Login page
      '/about-us', // Marketing pages
      '/learn',
      '/blog/*', // Blog content
      '/api/auth/login', // Kinde's login initiation endpoint
      '/api/auth/register', // Kinde's registration initiation endpoint
      '/api/uploadthing',
      '/api/auth/kinde_callback', // Kinde's OAuth callback endpoint
      '/api/users/check-email-availability', // Pre-registration validation
      '/error', // Error pages should be accessible to all
    ],
  },
);

export const config = {
  matcher: [
    '/((?!_next|api/auth/health|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
