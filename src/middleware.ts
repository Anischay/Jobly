import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/early-access",
    "/auth/sign-in",
    "/auth/sign-up",
    "/blog",
    "/contact",
    "/api/webhooks(.*)",
    "/api/oauth(.*)",
    "/demo(.*)"
  ],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/auth/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If the user is signed in and trying to access auth pages, redirect them to dashboard
    if (auth.userId && (req.nextUrl.pathname === '/auth/sign-in' || req.nextUrl.pathname === '/auth/sign-up')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};