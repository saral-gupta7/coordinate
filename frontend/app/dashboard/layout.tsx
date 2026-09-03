import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { getCurrentSession } from '@/lib/session';
import QueryProviderClient from '@/providers/query-client-provider';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome to your dashboard!',
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login');
  }
  return (
    <QueryProviderClient>
      <DashboardShell
        user={{
          name: session.user.name,
          image: session.user.image,
        }}
      >
        {children}
      </DashboardShell>
    </QueryProviderClient>
  );
}
