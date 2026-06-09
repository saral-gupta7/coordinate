'use client';

import SignOut from '@/components/sign-out';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { BookOpenText, LibraryBig, PanelLeft, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <main className="min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.022)_0,rgba(255,255,255,.022)_1px,transparent_1px,transparent_9px)]"
      />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#07080a]/88 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link
              className="group flex items-center gap-2 text-sm font-semibold"
              href="/"
            >
              <span className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10">
                <Sparkles className="size-4 transition-transform group-hover:scale-110" />
              </span>
              Coordinate
            </Link>
            <PanelLeft className="size-4 text-[#77716a]" />
          </div>

          <nav aria-label="Dashboard" className="flex-1 px-3 py-5">
            <p className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
              Workspace
            </p>
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    className={`group flex h-11 items-center gap-3 border px-3 text-sm transition-all hover:translate-x-1 ${
                      isActive
                        ? 'border-[#7887ff]/35 bg-[#7887ff]/12 text-white'
                        : 'border-transparent text-[#9d968e] hover:border-white/10 hover:bg-white/[0.045] hover:text-[#f4f1ea]'
                    }`}
                    href={item.href}
                    key={item.label}
                  >
                    <item.icon className="size-4 text-[#8f9aff]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-4 border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  className="size-10 border border-[#7887ff]/35"
                  size="lg"
                >
                  <AvatarImage
                    alt="Signed-in user profile image"
                    src={session?.user.image ?? undefined}
                  />
                  <AvatarFallback className="bg-[#14161d] text-[#d8d2ca]">
                    {getInitials(session?.user.name, session?.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#f4f1ea]">
                    {session?.user.name ?? 'Learner'}
                  </p>
                  <p className="truncate text-xs text-[#77716a]">
                    {session?.user.email}
                  </p>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="h-10 w-full bg-[#6f7dff] text-white hover:bg-[#7c8cff]"
            >
              <Link href="/create">
                <Plus className="size-4" />
                New course
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-72">
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
