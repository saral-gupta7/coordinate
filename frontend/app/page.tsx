import { BrandMark } from '@/components/brand-mark';
import { ModeToggle } from '@/components/theme-toggle';
import { auth } from '@/lib/auth';
import { ArrowRight, BookOpen, Check, GitBranch, Sparkles, UserRound } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';

const steps = [
  ['01', 'Describe the destination', 'Tell Coordinate what you want to learn, your starting point, and the outcome that matters.'],
  ['02', 'Receive a learning map', 'The planner interprets your intent, validates it, and builds a chapter sequence at the right depth.'],
  ['03', 'Turn plans into practice', 'Generate focused lessons and use chapter quizzes to check what actually stayed with you.'],
];

export default async function Home() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  return (
    <main className="bg-[var(--canvas)] text-[var(--ink)]">
      <div className="h-2 bg-[var(--accent-strong)] sm:h-3" />
      <div className="mx-auto max-w-[1600px] p-2 sm:p-5">
        <div className="overflow-hidden rounded-[20px] border bg-[var(--surface)] sm:rounded-[24px]">
          <header className="flex h-17 items-center justify-between border-b px-4 sm:h-20 sm:px-8">
            <Link className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.04em] sm:gap-3" href="/">
              <BrandMark className="size-9 sm:size-10" />
              <span className="hidden min-[420px]:inline">coordinate.</span>
            </Link>
            <nav className="flex items-center gap-2">
              <ModeToggle />
              {session?.user ? (
                <Link
                  className="focus-ring flex h-11 items-center gap-3 rounded-full border bg-[var(--surface-soft)] p-1.5 pr-4 text-sm font-semibold transition hover:border-[var(--accent)]"
                  href="/dashboard"
                >
                  <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={`${session.user.name}'s profile`}
                        className="size-full object-cover"
                        referrerPolicy="no-referrer"
                        src={session.user.image}
                      />
                    ) : (
                      <UserRound className="size-4" />
                    )}
                  </span>
                  <span className="hidden max-w-32 truncate sm:block">
                    {session.user.name}
                  </span>
                  <span className="sm:hidden">Profile</span>
                </Link>
              ) : (
                <>
                  <Link className="focus-ring hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)] sm:block" href="/login">
                    Sign in
                  </Link>
                  <Link className="focus-ring rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)] transition hover:bg-[var(--accent-strong)] sm:px-5 sm:hover:-translate-y-0.5" href="/dashboard">
                    <span className="min-[480px]:hidden">Start</span>
                    <span className="hidden min-[480px]:inline">Start learning</span>
                  </Link>
                </>
              )}
            </nav>
          </header>

          <section className="hairline-grid relative flex min-h-[590px] items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-[680px] sm:px-5 sm:py-24 lg:min-h-[730px]">
            <div className="absolute left-8 top-8 hidden size-28 border-l border-t lg:block" />
            <div className="absolute bottom-8 right-8 hidden size-28 border-b border-r lg:block" />
            <div className="relative max-w-5xl">
              <p className="mx-auto mb-7 flex w-fit items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] sm:mb-8 sm:gap-3 sm:text-xs sm:tracking-[0.22em]">
                <span className="size-1.5 bg-[var(--accent)]" />
                A course planner that becomes the course
              </p>
              <h1 className="text-balance text-[clamp(3rem,16vw,8.4rem)] font-medium leading-[0.86] tracking-[-0.065em] sm:leading-[0.82] sm:tracking-[-0.07em]">
                Find the path
                <span className="editorial-serif block font-medium text-[var(--accent-strong)]">through anything.</span>
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:mt-9 sm:text-lg sm:leading-7">
                Turn one clear request into a structured course, focused lessons, and quizzes that help you learn with direction.
              </p>
              <Link className="focus-ring mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-[var(--surface)] transition sm:mt-9 sm:h-13 sm:px-7 sm:hover:-translate-y-1" href="/dashboard">
                Build your first course <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>

          <section className="border-t px-5 py-8 sm:px-8">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Built with a dependable learning stack</p>
            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-[var(--line)] text-center text-sm font-semibold text-[var(--muted)] sm:grid-cols-5">
              {['Next.js', 'FastAPI', 'LangGraph', 'PostgreSQL', 'Gemini'].map((technology) => (
                <div className="bg-[var(--surface)] px-3 py-4 last:col-span-2 sm:px-5 sm:py-5 sm:last:col-span-1" key={technology}>{technology}</div>
              ))}
            </div>
          </section>
        </div>

        <section className="grid gap-8 px-2 py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div className="self-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">One workspace</p>
            <h2 className="mt-5 max-w-xl text-balance text-[clamp(2.25rem,11vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:leading-[0.95] sm:tracking-[-0.06em]">
              From vague ambition to the next clear chapter.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
              Your dashboard is both the starting point and the library. New courses appear beside the paths you are already following.
            </p>
          </div>
          <div className="panel-shadow rounded-[24px] border bg-[var(--surface)] p-2.5 sm:rounded-[30px] sm:p-3">
            <div className="rounded-[22px] bg-[var(--surface-soft)] p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Course composer</span>
                <Sparkles className="size-4 text-[var(--accent-strong)]" />
              </div>
              <p className="mt-8 max-w-xl text-lg leading-7 text-[var(--ink)] sm:mt-12 sm:text-xl sm:leading-8">Teach me practical SQL for analytics. I know spreadsheets, but I have never worked with a database.</p>
              <div className="mt-12 flex justify-end sm:mt-20">
                <span className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-ink)]">Generate</span>
              </div>
            </div>
            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              {[
                [BookOpen, '6 chapters'],
                [GitBranch, 'Beginner path'],
                [Check, 'Reviewed plan'],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof BookOpen;
                return <div className="flex items-center gap-3 rounded-xl border px-4 py-4 text-sm font-medium" key={label as string}><ItemIcon className="size-4 text-[var(--accent-strong)]" />{label as string}</div>;
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border bg-[var(--surface)] px-5 py-14 text-[var(--ink)] sm:rounded-[24px] sm:px-10 sm:py-20 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">How it works</p>
          <div className="mt-8 grid border-y sm:mt-10 lg:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <article className="border-b py-9 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0" key={number}>
                <span className="text-xs text-[var(--accent-strong)]">{number}</span>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] sm:mt-14">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-2 py-20 text-center sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">Your next subject</p>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance text-[clamp(2.5rem,13vw,7rem)] font-semibold leading-[0.92] tracking-[-0.065em] sm:leading-[0.88] sm:tracking-[-0.07em]">
            Start with one
            <span className="editorial-serif block text-[var(--accent-strong)]">good question.</span>
          </h2>
          <Link className="focus-ring mt-9 inline-flex h-13 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-sm font-semibold text-[var(--surface)]" href="/dashboard">
            Create a course <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
