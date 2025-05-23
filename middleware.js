import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('access_token');
  const url = request.nextUrl;
  const isAuthRoute = ['/login', '/signup', 'reset-password'].includes(url.pathname);

  if (token && isAuthRoute) {
    // If authenticated and trying to access login or signup, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // You can also add logic here to protect private routes like /dashboard
  // if (!token && url.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard/:path*', '/profile/:path*'],
};
