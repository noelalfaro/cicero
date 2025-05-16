import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextResponse } from 'next/server';
import { KindeRequest } from '@/lib/types';

export default withAuth(
  async function middleware(req: KindeRequest) {
    const kindeSession = req.kindeAuth;
    const { pathname } = req.nextUrl;

    const onboardingBypassPaths = [
      '/onboarding',
      '/api/auth/logout',
      '/api/users/update-username',
      '/api/users/check-username-availability',
      '/api/users/update-onboarding-status',
    ];

    // A user is considered authenticated if kindeSession and kindeSession.user exist
    // Kinde's `withAuth` should handle redirecting to loginPage if no valid session.
    // Our main concern here is the onboarding check for *already authenticated* users.
    if (kindeSession && kindeSession.user && kindeSession.token) {
      if (onboardingBypassPaths.includes(pathname)) {
        return NextResponse.next();
      }

      // ** Logs the users information(user, tokens)
      // console.log('--- Kinde Session Info (Authenticated User) ---');
      // console.log(
      //   'kindeSession.user:',
      //   JSON.stringify(kindeSession.user, null, 2),
      // );
      // console.log(
      //   'kindeSession.token ',
      //   JSON.stringify(kindeSession.token, null, 2),
      // );

      // --- Onboarding Check Logic ---
      // Accessing your custom claim:
      // It's good to check for the existence of user_properties and the specific claim first.
      const onboardingPropertyValue =
        kindeSession.token.user_properties?.onboarding_completed?.v;

      // The value 'v' from Kinde custom properties might be a string "true" or "false"
      // or a boolean true/false. Adjust comparison accordingly.
      // Let's assume it could be a string "true" or boolean true.
      let onboardingCompleted = false;
      if (typeof onboardingPropertyValue === 'string') {
        onboardingCompleted = onboardingPropertyValue.toLowerCase() === 'true';
      } else if (typeof onboardingPropertyValue === 'boolean') {
        onboardingCompleted = onboardingPropertyValue;
      }

      // console.log(
      //   `User ${kindeSession.user?.id} - Onboarding property value: '{onboardingPropertyValue}', Parsed as completed: ${onboardingCompleted}`,
      // );

      if (!onboardingCompleted) {
        console.log(
          `Redirecting user ${kindeSession.user?.id} to /onboarding.`,
        );
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    } else {
      console.log(
        'Middleware: No valid Kinde session or user not authenticated. Path:',
        pathname,
      );
    }

    return NextResponse.next();
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
