import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  // Clear the auth cookie
  response.cookies.delete('authToken');
  return response;
}