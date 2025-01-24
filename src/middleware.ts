import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  // Check for test mode
  if (request.nextUrl.searchParams.has('test')) {
    return NextResponse.next()
  }

  // Only run this middleware for the OAuth callback
  if (request.nextUrl.pathname.startsWith('/api/auth/callback/google')) {
    const response = NextResponse.next()
    
    // Get the email from the callback URL
    const email = request.nextUrl.searchParams.get('email')
    
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (!user) {
        // Update the user's role in the database
        await prisma.user.update({
          where: { email },
          data: {
            role: 'CANDIDATE' // Default to CANDIDATE for now
          }
        })
      }
    }
    
    return response
  }

  // Check if the request is for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/jobs') ||
                          request.nextUrl.pathname.startsWith('/candidates')

  if (isProtectedRoute) {
    // Allow test mode access
    if (request.nextUrl.searchParams.has('test')) {
      return NextResponse.next()
    }

    // Redirect to early access page if not authenticated
    const response = NextResponse.redirect(new URL('/early-access', request.url))
    return response
  }
  
  return NextResponse.next()
} 