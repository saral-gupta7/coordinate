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
      <div className="h-3 bg-[var(--accent-strong)]" />
      <div className="mx-auto max-w-[1600px] p-3 sm:p-5">
        <div className="overflow-hidden rounded-[24px] border bg-[var(--surface)]">
          <header className="flex h-20 items-center justify-between border-b px-5 sm:px-8">
            <Link className="flex items-center gap-3 text-xl font-semibold tracking-[-0.04em]" href="/">
              <BrandMark />
              coordinate.
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
                  <Link className="focus-ring rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]" href="/dashboard">
                    Start learning
                  </Link>
                </>
              )}
            </nav>
          </header>

          <section className="hairline-grid relative flex min-h-[730px] items-center justify-center overflow-hidden px-5 py-24 text-center">
            <div className="absolute left-8 top-8 hidden size-28 border-l border-t lg:block" />
            <div className="absolute bottom-8 right-8 hidden size-28 border-b border-r lg:block" />
            <div className="relative max-w-5xl">
              <p className="mx-auto mb-8 flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                <span className="size-1.5 bg-[var(--accent)]" />
                A course planner that becomes the course
              </p>
              <h1 className="text-[clamp(3.4rem,8.2vw,8.4rem)] font-medium leading-[0.82] tracking-[-0.07em]">
                Find the path
                <span className="editorial-serif block font-medium text-[var(--accent-strong)]">through anything.</span>
              </h1>
              <p className="mx-auto mt-9 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Turn one clear request into a structured course, focused lessons, and quizzes that help you learn with direction.
              </p>
              <Link className="focus-ring mt-9 inline-flex h-13 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-sm font-semibold text-[var(--surface)] transition hover:-translate-y-1" href="/dashboard">
                Build your first course <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>

          <section className="border-t px-5 py-8 sm:px-8">
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Built with a dependable learning stack</p>
            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-[var(--line)] text-center text-sm font-semibold text-[var(--muted)] sm:grid-cols-5">
              {['Next.js', 'FastAPI', 'LangGraph', 'PostgreSQL', 'Gemini'].map((technology) => (
                <div className="bg-[var(--surface)] px-5 py-5" key={technology}>{technology}</div>
              ))}
            </div>
          </section>
        </div>

        <section className="grid gap-8 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div className="self-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">One workspace</p>
            <h2 className="mt-5 max-w-xl text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
              From vague ambition to the next clear chapter.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
              Your dashboard is both the starting point and the library. New courses appear beside the paths you are already following.
            </p>
          </div>
          <div className="panel-shadow rounded-[30px] border bg-[var(--surface)] p-3">
            <div className="rounded-[22px] bg-[var(--surface-soft)] p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Course composer</span>
                <Sparkles className="size-4 text-[var(--accent-strong)]" />
              </div>
              <p className="mt-12 max-w-xl text-xl leading-8 text-[var(--ink)]">Teach me practical SQL for analytics. I know spreadsheets, but I have never worked with a database.</p>
              <div className="mt-20 flex justify-end">
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

        <section className="rounded-[24px] border bg-[var(--surface)] px-5 py-20 text-[var(--ink)] sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">How it works</p>
          <div className="mt-10 grid border-y lg:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <article className="border-b py-9 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0" key={number}>
                <span className="text-xs text-[var(--accent-strong)]">{number}</span>
                <h3 className="mt-14 text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-28 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">Your next subject</p>
          <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
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
