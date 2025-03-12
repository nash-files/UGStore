import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()
  
  // Get the pathname from the URL
  const path = req.nextUrl.pathname
  
  // Define protected routes and their required roles
  const protectedRoutes = {
    '/admin': ['admin'],
    '/admin/dashboard': ['admin'],
    '/admin/resources': ['admin'],
    '/admin/users': ['admin'],
    '/creator/dashboard': ['creator', 'admin'],
    '/creator/resources': ['creator', 'admin'],
    '/creator/analytics': ['creator', 'admin'],
    '/creator/settings': ['creator', 'admin'],
    '/profile': ['user', 'creator', 'admin'],
    '/settings': ['user', 'creator', 'admin'],
  }
  
  // Check if the current path is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    path === route || path.startsWith(`${route}/`)
  )
  
  // If the route is protected and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // If there's a session, check role-based access for protected routes
  if (session) {
    // Get user role from session
    const userRole = session.user?.user_metadata?.role || 'user'
    
    // Check if user has access to the route
    for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
      if ((path === route || path.startsWith(`${route}/`)) && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page if user doesn't have the required role
        return NextResponse.redirect(new URL('/unauthorized', req.url))
      }
    }
  }
  
  return res
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files (e.g. robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}

