import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(
  async function middleware(req: any) {
    // console.log('look at me', req.kindeAuth);
  },
  {
    isReturnToCurrentPage: true,
    loginPage: '/login',
    publicPaths: ['/register', '/login', '/about-us', '/learn', '/', '/blog/*'],
  },
);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
