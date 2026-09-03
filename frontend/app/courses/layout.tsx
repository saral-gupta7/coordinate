import QueryProviderClient from '@/providers/query-client-provider';

export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProviderClient>{children}</QueryProviderClient>;
}
