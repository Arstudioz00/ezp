// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Ensure that you have the JWT_SECRET defined in your environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined.');
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  console.log('Middleware Execution:');
  console.log('Token:', token);
  console.log('Pathname:', request.nextUrl.pathname);
  console.log('Is Auth Page:', isAuthPage);
  console.log('Is API Route:', isApiRoute);

  // Paths that don't require authentication
  const publicPaths = [
    '/auth/login',
    '/auth/register',
    // Add more public paths if needed
  ];

  // If the request is for a public path or API, allow it
  if (
    isApiRoute ||
    publicPaths.some((path) => request.nextUrl.pathname.startsWith(path)) ||
    request.nextUrl.pathname.startsWith('/_next')
  ) {
    console.log('Public path or API route. Allowing request.');
    return NextResponse.next();
  }

  if (token) {
    try {
      console.log('Attempting to verify token...');
      // Decode and verify the JWT token
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      console.log('Token is valid. Payload:', payload);

      // If the user is trying to access an auth page while authenticated, redirect to dashboard
      if (isAuthPage) {
        console.log('Authenticated user accessing auth page. Redirecting to /dashboard.');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Proceed to the requested page
      console.log('Authenticated user accessing protected page. Allowing request.');
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error);

      // If token verification fails, redirect to login unless it's a public path or API
      if (!isAuthPage && !isApiRoute) {
        console.log('Invalid token. Redirecting to /auth/login.');
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      return NextResponse.next();
    }
  } else {
    // No token present
    console.log('No token found.');

    // If the user is trying to access a protected page, redirect to login
    if (!isAuthPage && !isApiRoute) {
      console.log('Unauthenticated user accessing protected page. Redirecting to /auth/login.');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If accessing auth pages without a token, allow
    console.log('Unauthenticated user accessing auth page or API. Allowing request.');
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
