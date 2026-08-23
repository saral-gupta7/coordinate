import { QuizWorkspace } from '@/components/dashboard/quiz-workspace';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.id) redirect('/login');

  const { courseId, chapterId } = await params;
  const course = await prisma.course.findFirst({
    where: { id: courseId, userId: session.user.id },
    select: {
      id: true,
      title: true,
      chapters: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true, status: true, quizJson: true },
      },
    },
  });
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  if (!course || !chapter) notFound();

  return (
    <QuizWorkspace
      chapter={{ id: chapter.id, order: chapter.order, quizJson: chapter.quizJson, title: chapter.title }}
      course={{
        id: course.id,
        title: course.title,
        chapters: course.chapters.map(({ id, order, status, title }) => ({ id, order, status, title })),
      }}
    />
  );
}
