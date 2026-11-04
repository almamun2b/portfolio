import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SIGN_IN } from "@/lib/auth/safe-path";
import { SESSION_COOKIE_PATTERN } from "@/lib/auth/session-policy";

// UX only, never the security check (ARCHITECTURE.md §3): it sends visitors
// without a session cookie to the sign-in page before any admin code runs.
// Every page, DAL function and Server Action still verifies the session.

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === ADMIN_SIGN_IN) return NextResponse.next();

  const hasCookie = request.cookies
    .getAll()
    .some(({ name }) => SESSION_COOKIE_PATTERN.test(name));
  if (hasCookie) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = ADMIN_SIGN_IN;
  url.search = "";
  if (request.method === "GET") url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
