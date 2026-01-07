import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the requested path starts with /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check for the auth_token cookie
    const token = request.cookies.get("auth_token");

    // If no token exists, redirect to the sign-in page
    if (!token) {
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed if valid or not an admin route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths starting with /admin
    "/admin/:path*",
  ],
};
