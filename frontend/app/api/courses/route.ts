import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const courses = await prisma.course.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        progress: true,
        status: true,
        updatedAt: true,
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 },
    );
  }
}
