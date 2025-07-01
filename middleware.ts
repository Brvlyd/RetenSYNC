import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow login and register pages
  if (
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register')
  ) {
    return NextResponse.next();
  }

  // Check for authentication cookie (e.g., 'token')
  const token = request.cookies.get('token');

  if (!token) {
    // If not authenticated, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow access
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