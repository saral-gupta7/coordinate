import { getCourseChapter } from '@/lib/courses';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      courseId: string;
      chapterId: string;
    }>;
  },
) {
  const session = await getSession(request);

  if (!session?.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId, chapterId } = await context.params;

  try {
    const chapter = await getCourseChapter(
      session.user.id,
      courseId,
      chapterId,
    );

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({ chapter });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch chapter' },
      { status: 500 },
    );
  }
}
