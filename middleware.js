/* import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardPage = pathname.startsWith('/dashboard');

  // Handle authentication redirects
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

  // Handle role-based access
  if (token) {
    const role = token.role;
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/owner') && role !== 'owner') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}
 */
// middleware.js (or _middleware.js in the pages directory for Next.js 12+)
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value; // Assuming you store the token in a cookie

  const protectedRoutes = ['/dashboard', '/profile', /* add other protected routes */];

  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If you want to verify the token on the server (more secure), you could do that here
    // by making an API call to your Laravel backend.
    // Example (conceptual):
    // try {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/verify-token`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   if (!response.ok) {
    //     return NextResponse.redirect(new URL('/login', request.url));
    //   }
    // } catch (error) {
    //   console.error('Token verification failed:', error);
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }

  // Redirect authenticated users away from login/signup pages
  const authRoutes = ['/login', '/signup'];
  if (authRoutes.includes(request.nextUrl.pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/signup'],
};