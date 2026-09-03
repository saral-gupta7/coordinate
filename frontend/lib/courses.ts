import { prisma } from '@/lib/db';
import 'server-only';

export async function getDashboardCourses(userId: string) {
  const courses = await prisma.course.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      progress: true,
      status: true,
      courseDepth: true,
      experienceLevel: true,
      updatedAt: true,
      _count: {
        select: {
          chapters: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return courses.map((course) => ({
    ...course,
    updatedAt: course.updatedAt.toISOString(),
  }));
}

export async function getCourseChapter(
  userId: string,
  courseId: string,
  chapterId: string,
) {
  return prisma.chapter.findFirst({
    where: {
      id: chapterId,
      courseId,
      course: {
        userId,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      quizJson: true,
      projectTask: true,
      status: true,
      estimatedDuration: true,
      learningOutcomes: true,
      order: true,
    },
  });
}

export async function getCourseWorkspaceData(
  userId: string,
  courseId: string,
  requestedChapterId?: string,
) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      goal: true,
      courseDepth: true,
      status: true,
      progress: true,
      experienceLevel: true,
      chapters: {
        orderBy: {
          order: 'asc',
        },
        select: {
          id: true,
          title: true,
          status: true,
          order: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const selectedChapterId =
    course.chapters.find((chapter) => chapter.id === requestedChapterId)?.id ??
    course.chapters.find((chapter) => chapter.status === 'READY')?.id ??
    course.chapters[0]?.id;

  const initialChapter = selectedChapterId
    ? await getCourseChapter(userId, courseId, selectedChapterId)
    : null;

  return {
    course,
    initialChapter,
  };
}
