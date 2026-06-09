import { prisma } from '@/lib/db';
import type { CoursePlanResponse } from '@/lib/schemas/course.schema';
import { createCourseSchema } from '@/lib/schemas/course.schema';
import { getSession } from '@/lib/session';
import { ExperienceLevel } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

function toPrismaExperienceLevel(
  level: 'beginner' | 'intermediate' | 'advanced',
) {
  switch (level) {
    case 'beginner':
      return ExperienceLevel.BEGINNER;
    case 'intermediate':
      return ExperienceLevel.INTERMEDIATE;
    case 'advanced':
      return ExperienceLevel.ADVANCED;
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createCourseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid course request.',
        issues: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const fastApiBaseUrl =
    process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';

  const internalToken = process.env.FASTAPI_INTERNAL_TOKEN ?? 'local-dev-token';

  const response = await fetch(
    `${fastApiBaseUrl}/internal/agents/course-plan`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalToken}`,
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email ?? '',
      },
      body: JSON.stringify(parsed.data),
    },
  );

  const data = (await response.json()) as CoursePlanResponse;

  if (!response.ok) {
    return NextResponse.json(data, {
      status: response.status,
    });
  }

  if (data.status !== 'completed' || !data.course) {
    return NextResponse.json(data, {
      status: 500,
    });
  }

  const savedCourse = await prisma.course.create({
    data: {
      userId: session.user.id,
      title: data.course.title,
      description: data.course.description,
      goal: data.course.goal,
      learningMode: data.course.learning_mode,
      preferredStyle: data.course.preferred_style,
      weeklyCommitment: data.course.weekly_commitment,
      finalProject: data.course.final_project,
      learningObjectives: data.course.learning_objectives,
      assessmentPlan: data.course.assessment_plan,
      prerequisites: data.course.prerequisites,
      status: 'COMPLETED',
      experienceLevel: toPrismaExperienceLevel(data.course.experience_level),
      plannerAgentRunId: data.agent_run_id,
      chapters: {
        create: data.course.chapters.map((chapter) => ({
          title: chapter.title,
          description: chapter.description,
          order: chapter.order,
          estimatedDuration: chapter.estimated_duration,
          learningOutcomes: chapter.learning_outcomes,
          status: 'PLANNED',
        })),
      },
    },
    include: {
      chapters: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  return NextResponse.json({
    courseId: savedCourse.id,
    agentRunId: data.agent_run_id,
    course: savedCourse,
    trace: data.trace,
  });
}
