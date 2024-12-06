import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userName = request.cookies.get('userName');

  if (!userName && request.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/login', request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/detail-post/:path*',
    '/edit-post/:path*',
    '/create-post/:path*',
  ],
};
