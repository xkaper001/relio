import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    console.log('Middleware:', {
      path: req.nextUrl.pathname,
      isAuth,
      hasToken: !!token,
      tokenSub: token?.sub
    })

    // If user is authenticated and tries to access auth pages, redirect to dashboard
    if (isAuthPage && isAuth) {
      console.log('Redirecting authenticated user from auth page to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not authenticated and tries to access dashboard, redirect to signin
    if (isDashboard && !isAuth) {
      console.log('Redirecting unauthenticated user from dashboard to signin')
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow the middleware function to handle authorization logic
        // This prevents NextAuth from automatically redirecting
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',  // Protect all dashboard routes
    '/auth/signin',       // Redirect authenticated users away from signin
    '/auth/signup',       // Redirect authenticated users away from signup
  ],
}
