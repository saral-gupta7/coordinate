import { CourseWorkspace } from '@/components/dashboard/course-workspace';
import { auth } from '@/lib/auth';
import { getCourseWorkspaceData } from '@/lib/courses';
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
  const workspace = await getCourseWorkspaceData(
    session.user.id,
    courseId,
    chapter,
  );

  if (!workspace) {
    notFound();
  }

  return (
    <CourseWorkspace
      course={workspace.course}
      initialChapter={workspace.initialChapter}
    />
  );
}
