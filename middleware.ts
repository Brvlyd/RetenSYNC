import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /auth/login)
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register'];
  
  // Check if the current path is public
  const isPublicPath = publicPaths.includes(pathname);

  // Get the token from cookies (in a real app, you'd check for a proper auth token)
  // For this demo, we'll check localStorage on the client side
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected routes, redirect to login if not authenticated
  // Note: This is a simplified check. In a real app, you'd validate the token properly
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/feedback') || 
      pathname.startsWith('/performance-review') ||
      pathname.startsWith('/goals') ||
      pathname.startsWith('/1on1') ||
      pathname.startsWith('/shoutouts') ||
      pathname.startsWith('/learning') ||
      pathname.startsWith('/analytics')) {
    
    // In a real app, you'd check for a valid session/token here
    // For this demo, we'll let the client-side handle the redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};