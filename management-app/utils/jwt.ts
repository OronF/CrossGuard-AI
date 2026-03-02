import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export type JwtPayload = {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
};

export function parseAuthCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const token = cookies.authToken || null;
  console.log(`[parseAuthCookie] Raw cookies:`, Object.keys(cookies), `authToken found:`, !!token);
  return token;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    console.log(`[verifyJwt] Token verified successfully for user: ${payload.username}`);
    return payload;
  } catch (error) {
    console.error('[verifyJwt] JWT verification failed:', (error as Error).message);
    return null;
  }
}