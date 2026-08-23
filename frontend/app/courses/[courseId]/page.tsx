import { CourseWorkspace, type CourseWorkspaceCourse } from '@/components/dashboard/course-workspace';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect('/login');

  const { courseId } = await params;
  const { chapter } = await searchParams;
  const course = await prisma.course.findFirst({
    where: { id: courseId, userId: session.user.id },
    select: {
      id: true,
      title: true,
      description: true,
      goal: true,
      courseDepth: true,
      finalProject: true,
      status: true,
      progress: true,
      experienceLevel: true,
      chapters: {
        orderBy: { order: 'asc' },
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
          estimatedDuration: true,
          learningOutcomes: true,
          order: true,
        },
      },
    },
  });

  if (!course) notFound();

  return <CourseWorkspace course={course as CourseWorkspaceCourse} initialChapterId={chapter} />;
}
