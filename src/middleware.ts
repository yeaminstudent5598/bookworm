import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ১. এপিআই এবং স্ট্যাটিক ফাইলগুলো ফিল্টার করা
  if (
    path.startsWith('/api') || 
    path.startsWith('/_next') || 
    path.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // ২. কুকি থেকে ডাটা নেওয়া
  const accessToken = request.cookies.get('accessToken')?.value || '';
  const userRole = request.cookies.get('role')?.value || ''; 
  const isAuthenticated = !!accessToken;

  // ৩. পাবলিক পেজ লিস্ট
  const publicPaths = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/reset-password'
  ];
  
  const isPublicPath = publicPaths.includes(path);
  const isRootPath = path === '/';

  // ৪. রিডাইরেক্ট লজিক

  // ক) রুট পাথ (/) হ্যান্ডেল করা: লগইন না থাকলে লগইন পেজে, থাকলে রোল অনুযায়ী হোমে
  if (isRootPath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    const target = userRole === 'admin' ? '/admin/dashboard' : '/my-library';
    return NextResponse.redirect(new URL(target, request.nextUrl));
  }

  // খ) লগইন অবস্থায় পাবলিক পেজে গেলে রিডাইরেক্ট
  if (isPublicPath && isAuthenticated) {
    const target = userRole === 'admin' ? '/admin/dashboard' : '/my-library';
    return NextResponse.redirect(new URL(target, request.nextUrl));
  }

  // গ) লগআউট অবস্থায় প্রোটেক্টড পেজে এক্সেস বন্ধ করা
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // ঘ) রোল প্রোটেকশন: সাধারণ ইউজার যেন অ্যাডমিন পেজে না যেতে পারে
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/my-library', request.nextUrl));
  }

  return NextResponse.next();
}

// ৫. ম্যাচিং কনফিগারেশন
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};