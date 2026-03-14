import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const permissionId = searchParams.get('id');

  if (!permissionId) {
    return NextResponse.json({ error: 'Permission ID is required' }, { status: 400 });
  }

  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: String(permissionId), 
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error('Prisma Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}