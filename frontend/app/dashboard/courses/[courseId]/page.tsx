import {
  CourseWorkspace,
  type CourseWorkspaceCourse,
} from '@/components/dashboard/course-workspace';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { courseId } = await params;

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
      status: true,
      progress: true,
      experienceLevel: true,
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
          estimatedDuration: true,
          learningOutcomes: true,
          order: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return <CourseWorkspace course={course as CourseWorkspaceCourse} />;
}
