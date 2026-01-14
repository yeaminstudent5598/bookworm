import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (
    path.startsWith('/api') || 
    path.startsWith('/_next') || 
    path.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value || '';
  const userRole = request.cookies.get('role')?.value || ''; 
  const isAuthenticated = !!accessToken;

  const publicPaths = [
    '/login', '/register', '/forgot-password', '/reset-password'
  ];

  const userOnlyPaths = [
    '/my-library',
    '/dashboard', 
    '/profile',
    '/books',
    '/tutorials',
  ];
  
  const isPublicPath = publicPaths.includes(path);
  const isRootPath = path === '/';


  if (isRootPath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    const target = userRole === 'admin' ? '/admin/dashboard' : '/my-library';
    return NextResponse.redirect(new URL(target, request.nextUrl));
  }

  if (isPublicPath && isAuthenticated) {
    const target = userRole === 'admin' ? '/admin/dashboard' : '/my-library';
    return NextResponse.redirect(new URL(target, request.nextUrl));
  }

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }


  if (userRole === 'admin' && userOnlyPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
  }

  if (userRole !== 'admin' && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/my-library', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};