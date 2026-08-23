'use client';

import { BrandMark } from '@/components/brand-mark';
import SignOut from '@/components/sign-out';
import { ModeToggle } from '@/components/theme-toggle';
import { authClient } from '@/lib/auth-client';
import { BookOpen, Home, Library, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function NavButton({
  active,
  href,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  href?: string;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const className = `focus-ring group relative flex size-11 items-center justify-center rounded-xl transition ${
    active
      ? 'bg-[var(--surface)] text-[var(--ink)] shadow-sm'
      : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
  }`;

  const content = (
    <>
      {children}
      <span className="pointer-events-none absolute left-14 z-50 hidden whitespace-nowrap rounded-md bg-[var(--ink)] px-2.5 py-1.5 text-xs text-[var(--surface)] opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link aria-label={label} className={className} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <button aria-label={label} className={className} onClick={onClick} type="button">
      {content}
    </button>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  function openCourses() {
    if (pathname !== '/dashboard') {
      router.push('/dashboard#courses');
      return;
    }

    document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="min-h-svh bg-[var(--canvas)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[82px] border-r bg-[var(--rail)] lg:flex lg:flex-col lg:items-center">
        <Link aria-label="Coordinate home" className="mt-5" href="/">
          <BrandMark className="size-12" />
        </Link>

        <nav className="mt-14 flex flex-1 flex-col items-center gap-3" aria-label="Workspace">
          <NavButton active={pathname === '/dashboard'} href="/dashboard" label="Dashboard">
            <Home className="size-[19px]" />
          </NavButton>
          <NavButton label="Courses" onClick={openCourses}>
            <Library className="size-[19px]" />
          </NavButton>
          <NavButton active={pathname.startsWith('/courses/')} href="/dashboard#courses" label="Current course">
            <BookOpen className="size-[19px]" />
          </NavButton>
        </nav>

        <div className="mb-5 flex flex-col items-center gap-3">
          <ModeToggle />
          <div
            className="flex size-10 items-center justify-center overflow-hidden rounded-full border bg-[var(--surface)] text-xs font-semibold"
            title={session?.user.name ?? 'Learner'}
          >
            {session?.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="size-full object-cover" src={session.user.image} />
            ) : (
              <UserRound className="size-4" />
            )}
          </div>
          <SignOut />
        </div>
      </aside>

      <div className="min-h-svh pb-20 lg:pb-0 lg:pl-[82px]">{children}</div>

      <nav className="fixed inset-x-3 bottom-3 z-50 flex h-16 items-center justify-around rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 shadow-2xl backdrop-blur-xl lg:hidden">
        <NavButton active={pathname === '/dashboard'} href="/dashboard" label="Dashboard">
          <Home className="size-[19px]" />
        </NavButton>
        <NavButton label="Courses" onClick={openCourses}>
          <Library className="size-[19px]" />
        </NavButton>
        <ModeToggle />
        <SignOut />
      </nav>
    </main>
  );
}
