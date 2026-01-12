import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths jekhane login chara jaoa jabe
  const isPublicPath = path === '/login' || path === '/register';

  // Token verify (Ekhane amra cookie use korchi, apni localStorage use korle client-side guard lagbe)
  const token = request.cookies.get('token')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

// Routes specify korun jekhane middleware kaj korbe
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/my-library',
    '/books/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};