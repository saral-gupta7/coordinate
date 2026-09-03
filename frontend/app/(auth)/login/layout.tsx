import { getCurrentSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession().catch(() => null);

  if (session?.user) {
    redirect('/dashboard');
  }

  return children;
}
