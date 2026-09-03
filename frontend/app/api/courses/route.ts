import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { getDashboardCourses } from '@/lib/courses';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const courses = await getDashboardCourses(session.user.id);

    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 },
    );
  }
}
