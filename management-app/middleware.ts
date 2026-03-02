import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseAuthCookie, verifyJwt } from './utils/jwt';

// run middleware in Node.js environment so we can use crypto-dependent libraries
export const runtime = 'nodejs';


export async function middleware(request: NextRequest) {
  // 1. Get the JWT from the Cookie
  const cookieHeader = request.headers.get('cookie');
  const token = parseAuthCookie(cookieHeader ?? undefined);
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Token present: ${!!token}`);

  // 2. Define protected routes (example: all pages except the login page)
  const isProtectedRoute = !request.nextUrl.pathname.startsWith('/login');

  if (isProtectedRoute) {
    // 3. No token provided: Redirect to the login page
    if (!token) {
      console.log(`[Middleware] No token for protected route ${request.nextUrl.pathname}, redirecting to login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Verify the JWT
    const payload = verifyJwt(token);
    if (!payload) {
      // The token is invalid or expired, clear the invalid Cookie (optional)
      console.log(`[Middleware] Token verification failed for ${request.nextUrl.pathname}`);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }

    console.log(`[Middleware] Token verified for ${request.nextUrl.pathname}, user: ${payload.username}`);
    // 5. Verification passed: Attach user information to the request context (optional, needs to be used with route parameters)
    // Or obtain it through the getToken function in subsequent processing
  } else {
    // 6. Login page: If authenticated, redirect to the dashboard
    if (token && verifyJwt(token)) {
      console.log(`[Middleware] User already authenticated, redirecting from login to dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 7. Allow the request to continue
  console.log(`[Middleware] Allowing request to ${request.nextUrl.pathname} to continue`);
  return NextResponse.next();
}

// 8. Configure the scope of the middleware (match all pages except API routes and static resources)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};