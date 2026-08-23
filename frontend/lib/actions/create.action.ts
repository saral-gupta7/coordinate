'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { requireServerEnv } from '@/lib/server-env';
import type {
  CourseBlueprint,
  CoursePlanResponse,
} from '@/lib/schemas/course.schema';
import {
  acceptCourseSchema,
  createCourseSchema,
  reviseCourseSchema,
} from '@/lib/schemas/course.schema';
import {
  CourseDepth as PrismaCourseDepth,
  ExperienceLevel,
} from '@prisma/client';
import { headers } from 'next/headers';
import type { z } from 'zod';

type DraftSuccess = {
  ok: true;
  data: CoursePlanResponse & { course: CourseBlueprint };
};

type ActionFailure = {
  ok: false;
  error: string;
  detail?: string;
  issues?: unknown;
  data?: CoursePlanResponse;
};

export type CourseDraftActionResult = DraftSuccess | ActionFailure;

export type CourseAcceptedActionResult =
  | {
      ok: true;
      data: CoursePlanResponse & {
        course: CourseBlueprint;
        courseId: string;
      };
    }
  | ActionFailure;

type PlannerPayload = {
  prompt: string;
  current_course?: CourseBlueprint;
  feedback?: string;
  is_satisfied?: boolean;
};

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

function toPrismaCourseDepth(
  depth: 'quick_start' | 'standard' | 'comprehensive',
) {
  switch (depth) {
    case 'quick_start':
      return PrismaCourseDepth.QUICK_START;
    case 'standard':
      return PrismaCourseDepth.STANDARD;
    case 'comprehensive':
      return PrismaCourseDepth.COMPREHENSIVE;
  }
}

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

async function requestCoursePlanner(
  payload: PlannerPayload,
  user: { id: string; email?: string | null },
): Promise<CoursePlanResponse | ActionFailure> {
  const fastApiBaseUrl =
    process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';
  const internalToken = requireServerEnv('FASTAPI_INTERNAL_TOKEN');

  let response: Response;

  try {
    response = await fetch(`${fastApiBaseUrl}/internal/agents/course-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalToken}`,
        'X-User-Id': user.id,
        'X-User-Email': user.email ?? '',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
  } catch {
    return {
      ok: false,
      error: 'The course planner is unavailable. Try again in a moment.',
    };
  }

  let data: CoursePlanResponse;

  try {
    data = (await response.json()) as CoursePlanResponse;
  } catch {
    return {
      ok: false,
      error: 'The course planner returned an unreadable response.',
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: 'The course planner could not complete that request.',
    };
  }

  return data;
}

function plannerFailure(data: CoursePlanResponse): ActionFailure {
  const detail = data.trace.at(-1)?.summary ?? undefined;

  return {
    ok: false,
    error: 'Enter something meaningful.',
    detail,
    data,
  };
}

export async function generateCoursePlanAction(
  input: z.infer<typeof createCourseSchema>,
): Promise<CourseDraftActionResult> {
  const user = await getUser();
  if (!user?.id) return { ok: false, error: 'Unauthorized.' };

  const parsed = createCourseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? 'Enter something meaningful.',
      issues: parsed.error.flatten(),
    };
  }

  const result = await requestCoursePlanner(parsed.data, user);
  if ('ok' in result) return result;
  if (result.status === 'failed' || !result.course) return plannerFailure(result);

  return {
    ok: true,
    data: { ...result, course: result.course },
  };
}

export async function reviseCoursePlanAction(
  input: z.infer<typeof reviseCourseSchema>,
): Promise<CourseDraftActionResult> {
  const user = await getUser();
  if (!user?.id) return { ok: false, error: 'Unauthorized.' };

  const parsed = reviseCourseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Describe the changes you want.',
      issues: parsed.error.flatten(),
    };
  }

  const result = await requestCoursePlanner(
    {
      prompt: parsed.data.prompt,
      current_course: parsed.data.course,
      feedback: parsed.data.feedback,
      is_satisfied: false,
    },
    user,
  );

  if ('ok' in result) return result;
  if (result.status === 'failed' || !result.course) return plannerFailure(result);

  return {
    ok: true,
    data: { ...result, course: result.course },
  };
}

export async function acceptCoursePlanAction(
  input: z.infer<typeof acceptCourseSchema>,
): Promise<CourseAcceptedActionResult> {
  const user = await getUser();
  if (!user?.id) return { ok: false, error: 'Unauthorized.' };

  const parsed = acceptCourseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'The curriculum is incomplete. Generate it again.',
      issues: parsed.error.flatten(),
    };
  }

  const result = await requestCoursePlanner(
    {
      prompt: parsed.data.prompt,
      current_course: parsed.data.course,
      is_satisfied: true,
    },
    user,
  );

  if ('ok' in result) return result;
  if (result.status !== 'completed' || !result.course) {
    return plannerFailure(result);
  }

  const course = result.course;
  const savedCourse = await prisma.course.create({
    data: {
      userId: user.id,
      title: course.title,
      description: course.description,
      goal: course.goal,
      courseDepth: toPrismaCourseDepth(course.course_depth),
      finalProject: course.final_project,
      learningObjectives: course.learning_objectives,
      assessmentPlan: course.assessment_plan,
      prerequisites: course.prerequisites,
      status: 'COMPLETED',
      experienceLevel: toPrismaExperienceLevel(course.experience_level),
      plannerAgentRunId: result.agent_run_id,
      chapters: {
        create: course.chapters.map((chapter) => ({
          title: chapter.title,
          description: chapter.description,
          order: chapter.order,
          estimatedDuration: chapter.estimated_duration,
          learningOutcomes: chapter.learning_outcomes,
          status: 'PLANNED',
        })),
      },
    },
  });

  return {
    ok: true,
    data: {
      ...result,
      course,
      courseId: savedCourse.id,
    },
  };
}
