// import { getToken } from "next-auth/jwt";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export { default } from "next-auth/middleware";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   console.log("Token:", token);

//   if (!token) {
//     const url = request.nextUrl.clone();
//     url.pathname = "/login";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is on a protected route (dashboard)
  const protectedRoutes = [
    "/dashboard",
    "/projects",
    "/blogs",
    "/blog-category",
    "/projects/create",
    "/blogs/create",
    "/blog-category/create",
    "/projects/edit",
    "/blogs/edit",
    "/blog-category/edit",
  ];

  const isOnProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check for session token cookie (NextAuth uses this for JWT sessions)
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const isLoggedIn = !!sessionToken;

  // Redirect to sign-in if accessing dashboard without authentication
  if (isOnProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/login", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
