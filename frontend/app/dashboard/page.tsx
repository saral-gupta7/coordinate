import { getDashboardCourses } from '@/lib/courses';
import { DashboardWorkspace } from '@/components/dashboard/course-data';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) redirect('/login');
  const courses = await getDashboardCourses(session.user.id);

  return <DashboardWorkspace initialCourses={courses} userName={session.user.name}/>;
}
