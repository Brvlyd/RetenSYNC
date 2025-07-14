import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle asset requests
  if (request.nextUrl.pathname.startsWith('/assets/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/assets/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
