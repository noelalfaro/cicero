import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return withAuth(request);
}

// export default withAuth(async function middleware(request: NextRequest) {}, {
//   isReturnToCurrentPage: true,
//   loginPage: "/login",
// });

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard", "/notifications", "/my-profile", "/explore"],
};
