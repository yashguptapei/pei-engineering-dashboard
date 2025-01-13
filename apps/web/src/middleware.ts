import { type NextRequest, NextResponse } from "next/server";

const HOME_ROUTE = "/";
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];
const LOGIN_ROUTE = "/login";

export function middleware(request: NextRequest): NextResponse {
  const { pathname, searchParams } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");

  const isProtectedRoute =
    pathname === HOME_ROUTE ||
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // Check if the user is accessing a protected route without a session cookie
  if (isProtectedRoute) {
    if (!sessionCookie) {
      // Store the attempted route in the query string (last route they tried to access)
      const redirectUrl =
        pathname !== HOME_ROUTE
          ? `${LOGIN_ROUTE}?redirect=${encodeURIComponent(pathname)}`
          : LOGIN_ROUTE;

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // If accessing the login route with a valid session, redirect to the last attempted route or home
  if (pathname === LOGIN_ROUTE && sessionCookie) {
    const redirectTo = searchParams.get("redirect") || HOME_ROUTE;
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}
