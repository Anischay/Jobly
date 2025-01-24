import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public paths that don't require authentication
    const publicPaths = ['/auth', '/early-access', '/']
    if (publicPaths.some(p => path.startsWith(p))) {
      return NextResponse.next()
    }

    // Ensure user has role
    if (!token?.role) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Role-based route protection
    if (path.startsWith('/dashboard/candidate') && token.role !== 'CANDIDATE') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (path.startsWith('/dashboard/employer') && token.role !== 'EMPLOYER') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Specify which routes to protect
export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*', '/candidates/:path*', '/profile/:path*']
} 