import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1️⃣ API রুটগুলোকে মিডলওয়্যার রিডাইরেক্ট লজিক থেকে পুরোপুরি বাদ দিন
  // এতে আপনার 307 Redirect এরর সমাধান হবে
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2️⃣ সঠিক কুকি নাম ব্যবহার করুন (accessToken)
  const accessToken = request.cookies.get('accessToken')?.value || '';
  const isAuthenticated = !!accessToken;

  // 3️⃣ পাবলিক এবং প্রোটেক্টড রুট ডিফাইন করা
  const isPublicPath = ['/login', '/register'].includes(path);
  const isRootPath = path === '/';

  // 4️⃣ রিডাইরেক্ট লজিক (শুধুমাত্র UI পেজগুলোর জন্য)
  
  // রুট পাথে থাকলে
  if (isRootPath) {
    return NextResponse.redirect(new URL(isAuthenticated ? '/my-library' : '/login', request.nextUrl));
  }

  // যদি লগইন অবস্থায় লগইন/রেজিস্ট্রেশন পেজে যেতে চায়
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/my-library', request.nextUrl));
  }

  // যদি লগআউট অবস্থায় প্রটেক্টড পেজে যেতে চায়
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

// static ফাইলগুলো বাদ দিয়ে সবখানে মিডলওয়্যার চলবে
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};