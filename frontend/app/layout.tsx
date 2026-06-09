import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import QueryProviderClient from '@/providers/query-client-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Public_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

import './globals.css';

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Coordinate | Adaptive AI Learning Workspace',
  description:
    'Create personalized AI-generated courses, study lessons, take quizzes, chat with a course-aware tutor, and learn from your own documents.',
  openGraph: {
    type: 'website',
    url: 'coordinate.srlgpta.xyz',
    title: 'Coordinate',
    description:
      'Create personalized AI-generated courses, study lessons, take quizzes, chat with a course-aware tutor, and learn from your own documents.',
    siteName: 'Coordinate',
    images: [
      {
        url: 'https://i.pinimg.com/736x/3f/69/92/3f69928d7c7cf17f3061d560ad5e5f9f.jpg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        publicSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProviderClient>{children}</QueryProviderClient>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
