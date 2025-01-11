import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';

export default withAuth(
  async function middleware(req: any) {
    // console.log('look at me', req.kindeAuth);
  },
  {
    isReturnToCurrentPage: true,
    loginPage: '/login',
    publicPaths: ['/register', '/login', '/about-us', '/learn'],
  },
);

export const config = {
  matcher: [
    '/dashboard',
    '/notifications',
    '/explore',
    '/players/:path*',
    '/:username',
  ],
};
