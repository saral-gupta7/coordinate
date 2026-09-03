import { AppToaster } from '@/components/app-toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const editorial = Cormorant_Garamond({
  variable: '--font-editorial',
  subsets: ['latin'],
  style: ['italic'],
  weight: ['500', '600'],
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
        editorial.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
