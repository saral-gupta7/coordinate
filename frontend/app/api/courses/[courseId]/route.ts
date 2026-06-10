import { prisma } from '@/lib/db';
import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> },
) {
  const session = await getSession(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseId } = await context.params;

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        goal: true,
        learningMode: true,
        preferredStyle: true,
        weeklyCommitment: true,
        finalProject: true,
        learningObjectives: true,
        assessmentPlan: true,
        prerequisites: true,
        status: true,
        progress: true,
        imageUrl: true,
        experienceLevel: true,
        plannerAgentRunId: true,
        createdAt: true,
        updatedAt: true,
        chapters: {
          select: {
            id: true,
            title: true,
            description: true,
            content: true,
            quizJson: true,
            citationsJson: true,
            resourcesJson: true,
            projectTask: true,
            status: true,
            videoUrl: true,
            estimatedDuration: true,
            learningOutcomes: true,
            order: true,
            isCompleted: true,
            lessonAgentRunId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 },
    );
  }
}
