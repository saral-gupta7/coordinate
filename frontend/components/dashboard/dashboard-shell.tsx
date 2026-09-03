'use client';

import { BrandMark } from '@/components/brand-mark';
import SignOut from '@/components/sign-out';
import { ModeToggle } from '@/components/theme-toggle';
import { LayoutDashboard, Library, Plus, UserRound } from 'lucide-react';
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
  const className = `focus-ring group relative flex size-10 items-center justify-center rounded-xl transition ${
    active
      ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]'
      : 'text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]'
  }`;

  const content = (
    <>
      {children}
      <span className="pointer-events-none absolute left-12 z-50 hidden whitespace-nowrap rounded-lg bg-[var(--ink)] px-2.5 py-1.5 text-xs font-medium text-[var(--surface)] opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
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
    <button
      aria-label={label}
      className={className}
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  );
}

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; image?: string | null };
}) {
  const pathname = usePathname();
  const router = useRouter();

  function openCourses() {
    if (pathname !== '/dashboard') {
      router.push('/dashboard#courses');
      return;
    }

    document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' });
  }

  function openComposer() {
    if (pathname !== '/dashboard') {
      router.push('/dashboard#course-composer');
      return;
    }

    document
      .querySelector('#course-composer')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="min-h-svh bg-[var(--canvas)] text-[var(--ink)]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[68px] border-r bg-[var(--rail)] lg:flex lg:flex-col lg:items-center">
        <Link
          aria-label="Coordinate dashboard"
          className="focus-ring mt-5 rounded-xl"
          href="/dashboard"
        >
          <BrandMark className="size-8 rounded-[10px]" />
        </Link>

        <nav
          aria-label="Workspace"
          className="mt-12 flex flex-1 flex-col items-center gap-2"
        >
          <NavButton
            active={pathname === '/dashboard'}
            href="/dashboard"
            label="Dashboard"
          >
            <LayoutDashboard className="size-[18px]" />
          </NavButton>
          <NavButton label="New course" onClick={openComposer}>
            <Plus className="size-[18px]" />
          </NavButton>
          <NavButton label="Courses" onClick={openCourses}>
            <Library className="size-[18px]" />
          </NavButton>
        </nav>

        <div className="mb-4 flex flex-col items-center gap-2.5 border-t pt-4">
          <ModeToggle />
          <div
            className="flex size-9 items-center justify-center overflow-hidden rounded-full border bg-[var(--surface)] text-xs font-semibold"
            title={user.name || 'Learner'}
          >
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="size-full object-cover" src={user.image} />
            ) : (
              <UserRound className="size-4" />
            )}
          </div>
          <SignOut />
        </div>
      </aside>

      <div className="min-h-svh pb-24 lg:pb-0 lg:pl-[68px]">{children}</div>

      <nav className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 mx-auto flex h-15 max-w-sm items-center justify-around rounded-[20px] border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 shadow-[0_16px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl lg:hidden">
        <NavButton
          active={pathname === '/dashboard'}
          href="/dashboard"
          label="Dashboard"
        >
          <LayoutDashboard className="size-[18px]" />
        </NavButton>
        <NavButton label="New course" onClick={openComposer}>
          <Plus className="size-[18px]" />
        </NavButton>
        <NavButton label="Courses" onClick={openCourses}>
          <Library className="size-[18px]" />
        </NavButton>
        <ModeToggle />
        <SignOut />
      </nav>
    </main>
  );
}
