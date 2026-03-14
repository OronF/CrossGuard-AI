import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
        return NextResponse.json({ error: 'not authenticated' }, { status: 401 });
    }

    try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        username: true,
        permission_id: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'user not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.username,
      permission_id: user.permission_id,
    });
  } catch (err) {
    return NextResponse.json({ error: 'token is not vaild' }, { status: 401 });
  }
}