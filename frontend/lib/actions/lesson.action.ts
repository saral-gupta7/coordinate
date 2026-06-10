'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ChapterStatus } from '@prisma/client';
import { headers } from 'next/headers';

import {
  GenerateLessonActionResult,
  LessonBuildResponse,
} from '../schemas/lesson.schema';

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

export async function generateLessonAction(
  courseId: string,
  chapterId: string,
): Promise<GenerateLessonActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      ok: false,
      error: 'Unauthorized.',
    };
  }

  if (!courseId || !chapterId) {
    return {
      ok: false,
      error: 'Course and chapter are required.',
    };
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId: session.user.id,
    },
    include: {
      chapters: {
        where: {
          id: chapterId,
        },
        take: 1,
      },
    },
  });

  if (!course) {
    return {
      ok: false,
      error: 'Course not found.',
    };
  }

  const chapter = course.chapters[0];

  if (!chapter) {
    return {
      ok: false,
      error: 'Chapter not found.',
    };
  }

  await prisma.chapter.update({
    where: {
      id: chapter.id,
    },
    data: {
      status: ChapterStatus.GENERATING,
    },
  });

  const fastApiBaseUrl =
    process.env.FASTAPI_BASE_URL ?? 'http://127.0.0.1:8000';
  const internalToken = process.env.FASTAPI_INTERNAL_TOKEN ?? 'local-dev-token';

  const response = await fetch(
    `${fastApiBaseUrl}/internal/agents/lesson-build`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${internalToken}`,
        'X-User-Id': session.user.id,
        'X-User-Email': session.user.email ?? '',
      },
      body: JSON.stringify({
        course_id: course.id,
        chapter_id: chapter.id,
        course_title: course.title,
        course_description: course.description,
        course_goal: course.goal,
        experience_level: course.experienceLevel.toLowerCase(),
        learning_mode: course.learningMode,
        preferred_style: course.preferredStyle,
        final_project: course.finalProject,
        chapter_title: chapter.title,
        chapter_description: chapter.description,
        chapter_order: chapter.order,
        learning_outcomes: toStringList(chapter.learningOutcomes),
        estimated_duration: chapter.estimatedDuration,
      }),
    },
  );

  const data = (await response.json()) as LessonBuildResponse;

  if (!response.ok) {
    await prisma.chapter.update({
      where: {
        id: chapter.id,
      },
      data: {
        status: ChapterStatus.FAILED,
      },
    });

    return {
      ok: false,
      error: 'Lesson builder failed.',
      data,
    };
  }

  if (data.status !== 'completed' || !data.markdown_content || !data.quiz) {
    await prisma.chapter.update({
      where: {
        id: chapter.id,
      },
      data: {
        status: ChapterStatus.FAILED,
        lessonAgentRunId: data.agent_run_id,
      },
    });

    return {
      ok: false,
      error: 'Lesson builder did not return a completed lesson.',
      data,
    };
  }

  const updatedChapter = await prisma.chapter.update({
    where: {
      id: chapter.id,
    },
    data: {
      content: data.markdown_content,
      quizJson: data.quiz,
      resourcesJson: data.resources,
      citationsJson: data.citations,
      projectTask: data.project_task,
      lessonAgentRunId: data.agent_run_id,
      status: ChapterStatus.READY,
    },
  });

  return {
    ok: true,
    data: {
      chapterId: updatedChapter.id,
      lesson: data,
    },
  };
}
