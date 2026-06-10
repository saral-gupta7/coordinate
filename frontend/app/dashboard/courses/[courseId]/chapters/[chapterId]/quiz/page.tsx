import { QuizWorkspace } from '@/components/dashboard/quiz-workspace';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

type QuizPageProps = {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { chapterId, courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      chapters: {
        where: {
          id: chapterId,
        },
        select: {
          id: true,
          title: true,
          order: true,
          quizJson: true,
        },
        take: 1,
      },
    },
  });

  const chapter = course?.chapters[0];

  if (!course || !chapter) {
    notFound();
  }

  return (
    <QuizWorkspace
      chapter={{
        id: chapter.id,
        order: chapter.order,
        quizJson: chapter.quizJson,
        title: chapter.title,
      }}
      course={{
        id: course.id,
        title: course.title,
      }}
    />
  );
}
