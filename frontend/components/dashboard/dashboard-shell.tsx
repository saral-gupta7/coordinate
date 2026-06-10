'use client';

import SignOut from '@/components/sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import {
  BookOpenText,
  LibraryBig,
  PanelLeft,
  Plus,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const sidebarItems = [
  { label: 'Overview', href: '/dashboard', icon: LibraryBig },
  { label: 'Courses', href: '/dashboard/courses', icon: BookOpenText },
];

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return email?.slice(0, 2).toUpperCase() ?? 'U';
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return (
      window.localStorage.getItem('coordinate-sidebar-collapsed') === 'true'
    );
  });

  const sidebarWidth = isCollapsed ? '4rem' : '18rem';

  function toggleSidebar() {
    setIsCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem('coordinate-sidebar-collapsed', String(next));
      return next;
    });
  }

  return (
    <main
      className="min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white"
      style={{ '--sidebar-width': sidebarWidth } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.022)_0,rgba(255,255,255,.022)_1px,transparent_1px,transparent_9px)]"
      />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] border-r border-white/10 bg-[#07080a]/88 backdrop-blur-xl transition-[width] duration-300 ease-out lg:block">
        <div className="flex h-full flex-col">
          <div
            className={`flex border-b border-white/10 p-4 transition-all duration-300 ${
              isCollapsed
                ? 'flex-col items-center justify-center gap-3 px-0'
                : 'items-center justify-between px-4'
            }`}
          >
            <Link
              className={`group flex items-center text-sm font-semibold ${
                isCollapsed ? 'items-center justify-center' : ''
              }`}
              href="/"
            >
              <span
                className={`flex size-8 items-center justify-center transition-colors ${
                  isCollapsed
                    ? 'bg-transparent'
                    : 'border-white/14 bg-white/[0.04] group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10'
                }`}
              >
                <Sparkles className="size-4 transition-transform group-hover:scale-110" />
              </span>
              <span
                className={`origin-left overflow-hidden whitespace-nowrap transition-all duration-200 ${
                  isCollapsed ? 'hidden' : 'flex'
                }`}
              >
                Coordinate
              </span>
            </Link>
            <button
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="flex size-8 items-center justify-center text-[#77716a] transition-colors hover:border-white/10 hover:bg-white/[0.045] hover:text-white"
              onClick={toggleSidebar}
              type="button"
            >
              <PanelLeft
                className={`size-4 transition-transform duration-300 ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <nav
            aria-label="Dashboard"
            className={`flex-1 transition-all duration-300 ${
              isCollapsed ? 'px-2 py-8' : 'px-3 py-5'
            }`}
          >
            <p
              className={`px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a] transition-all duration-200 ${
                isCollapsed ? 'h-0 pb-0 opacity-0' : 'h-auto pb-3 opacity-100'
              }`}
            >
              Workspace
            </p>
            <div className={isCollapsed ? 'space-y-1' : 'space-y-1'}>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    aria-label={item.label}
                    className={`group relative flex h-11 items-center border px-3 text-sm transition-all duration-200 gap-2 ${
                      isCollapsed
                        ? 'mx-auto justify-center border-transparent bg-transparent px-0'
                        : 'hover:translate-x-1'
                    } ${
                      isCollapsed
                        ? isActive
                          ? 'text-white'
                          : 'text-[#9d968e] hover:text-[#f4f1ea]'
                        : isActive
                          ? 'border-[#7887ff]/35 bg-[#7887ff]/12 text-white'
                          : 'border-transparent text-[#9d968e] hover:border-white/10 hover:bg-white/[0.045] hover:text-[#f4f1ea]'
                    }`}
                    href={item.href}
                    key={item.label}
                  >
                    <item.icon className="size-4 shrink-0 text-[#8f9aff]" />
                    <span
                      className={`origin-left overflow-hidden whitespace-nowrap transition-all duration-200 ${
                        isCollapsed ? 'hidden' : 'flex'
                      }`}
                    >
                      {item.label}
                    </span>
                    {isCollapsed && (
                      <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 border border-white/10 bg-[#15171d] px-3 py-2 text-sm text-[#f4f1ea] opacity-0 shadow-xl shadow-black/30 transition-opacity group-hover:opacity-100">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div
            className={`border-t border-white/10 transition-all duration-300 ${
              isCollapsed ? 'flex flex-col items-center gap-3 p-2.5' : 'p-4'
            }`}
          >
            <div
              className={`group relative transition-all duration-200 ${
                isCollapsed
                  ? 'mb-0 flex size-10 items-center justify-center'
                  : 'mb-4 border border-white/10 bg-white/[0.025] p-3'
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="border border-[#7887ff]/35">
                  <AvatarImage
                    alt="Signed-in user profile image"
                    src={session?.user.image ?? undefined}
                  />
                  <AvatarFallback className="bg-[#14161d] text-[#d8d2ca]">
                    {getInitials(session?.user.name, session?.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`min-w-0 origin-left overflow-hidden transition-all duration-200 ${
                    isCollapsed ? 'hidden' : 'flex flex-col'
                  }`}
                >
                  <p className="text-sm font-medium">
                    {session?.user.name ?? 'Learner'}
                  </p>
                  <p className="mt-1 text-xs text-[#aaa39b]">
                    {session?.user.email}
                  </p>
                </div>
              </div>
              {isCollapsed && (
                <div className="pointer-events-none absolute bottom-0 left-12 z-50 min-w-56 border border-white/10 bg-[#15171d] px-3 py-2 opacity-0 shadow-xl shadow-black/30 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-sm font-medium text-[#f4f1ea]">
                    {session?.user.name ?? 'Learner'}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#aaa39b]">
                    {session?.user.email}
                  </p>
                </div>
              )}
            </div>
            <Button
              asChild
              className={`h-10 text-white ${
                isCollapsed
                  ? 'size-10 bg-transparent px-0 hover:bg-transparent hover:text-[#aab2ff]'
                  : 'w-full bg-[#6f7dff] hover:bg-[#7c8cff]'
              }`}
              size={isCollapsed ? 'icon' : 'default'}
            >
              <Link aria-label="Create course" href="/create">
                <Plus className="size-4" />
                <span
                  className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                  }`}
                >
                  New course
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 transition-[padding] duration-300 ease-out lg:pl-[var(--sidebar-width)]">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080a]/82 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04]"
                href="/"
              >
                <Sparkles className="size-4" />
              </Link>
              <span className="text-sm font-semibold">Coordinate</span>
            </div>

            <div className="hidden items-center gap-2 border border-[#6f7dff]/25 bg-[#6f7dff]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aab2ff] sm:flex">
              <LibraryBig className="size-3.5" />
              Course workspace
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button
                asChild
                className="hidden border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white sm:inline-flex"
                variant="outline"
              >
                <Link href="/create">
                  <Plus className="size-4" />
                  Create
                </Link>
              </Button>
              <Avatar className="size-9 border border-[#7887ff]/35">
                <AvatarImage
                  alt="Signed-in user profile image"
                  src={session?.user.image ?? undefined}
                />
                <AvatarFallback className="bg-[#14161d] text-[#d8d2ca]">
                  {getInitials(session?.user.name, session?.user.email)}
                </AvatarFallback>
              </Avatar>
              <SignOut />
            </div>
          </div>

          <nav
            aria-label="Mobile dashboard"
            className="flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-3 lg:hidden"
          >
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  className={`flex shrink-0 items-center gap-2 border px-3 py-2 text-xs ${
                    isActive
                      ? 'border-[#7887ff]/35 bg-[#7887ff]/12 text-white'
                      : 'border-white/10 bg-white/[0.035] text-[#c7c1b9]'
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <item.icon className="size-3.5 text-[#8f9aff]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}
