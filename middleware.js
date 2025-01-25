import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Redirect if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // Role-based access
  const role = token.role; // Assumes your token includes the user's role
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect non-admin users
  }
  if (pathname.startsWith('/user') && role !== 'user') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect non-user roles
  }
  if (pathname.startsWith('/owner') && role !== 'owner') {
    return NextResponse.redirect(new URL('/', req.url)); // Redirect non-owner users
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/owner/:path*'], 
};
