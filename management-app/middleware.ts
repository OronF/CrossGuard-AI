import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const token = request.cookies.get('auth_token');

//     if (!token && !request.nextUrl.pathname.startsWith('/login')) {
//         return NextResponse.redirect(new URL('/login', request.url));
//     }

//     return NextResponse.next();
// }

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}