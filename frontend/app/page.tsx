import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Layers3,
  ListChecks,
  LockKeyhole,
  Route,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const shipped = [
  {
    label: 'Course Planner',
    value: 'Live',
  },
  {
    label: 'Lesson Builder',
    value: 'Live',
  },
  {
    label: 'Quiz Workspace',
    value: 'Live',
  },
];

const workflow = [
  {
    icon: Route,
    title: 'Plan',
    body: 'Turn a topic, goal, level, and schedule into a structured course.',
  },
  {
    icon: BookOpenText,
    title: 'Study',
    body: 'Generate lessons, outcomes, project tasks, resources, and citations.',
  },
  {
    icon: ListChecks,
    title: 'Check',
    body: 'Take chapter quizzes with instant correctness and explanations.',
  },
];

export default function Home() {
  return (
    <main className="min-h-svh overflow-hidden bg-[#08090b] text-[#f4f1ea] selection:bg-[#7ed7a5] selection:text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.022)_0,rgba(255,255,255,.022)_1px,transparent_1px,transparent_9px)]"
      />

      <header className="relative z-10 border-b border-white/10 bg-[#08090b]/88 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2 text-sm font-semibold" href="/">
            <span className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7ed7a5]/50 group-hover:bg-[#7ed7a5]/10">
              <Sparkles className="size-4 transition-transform group-hover:scale-110" />
            </span>
            Coordinate
          </Link>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="text-[#b8b1a8] hover:bg-white/[0.06] hover:text-white"
              size="sm"
              variant="ghost"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              asChild
              className="bg-[#f4f1ea] text-black hover:bg-white"
              size="sm"
            >
              <Link href="/create">
                Create
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="relative z-10 border-b border-white/10">
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[#7ed7a5]/35 bg-[#7ed7a5]/10 text-[#d8f8e3]">
                Backend live
              </Badge>
              <Badge
                className="border-white/10 bg-white/[0.035] text-[#9d968e]"
                variant="outline"
              >
                FastAPI + LangGraph
              </Badge>
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-normal text-[#f4f1ea] sm:text-6xl">
              AI courses that become study workspaces.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#aaa39b]">
              Coordinate creates structured courses, generates chapter lessons,
              and turns quizzes into an interactive study flow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 bg-[#7ed7a5] px-5 text-black hover:bg-[#98e7ba]"
              >
                <Link href="/create">
                  Start a course
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 border-white/14 bg-white/[0.035] px-5 text-[#d8d2ca] hover:bg-white/[0.08] hover:text-white"
                variant="outline"
              >
                <Link href="/dashboard/courses">Open dashboard</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 border border-white/10 bg-white/[0.025]">
              {shipped.map((item) => (
                <div className="border-r border-white/10 p-4 last:border-r-0" key={item.label}>
                  <p className="font-mono text-xl text-[#f4f1ea]">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#827c74]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full border border-white/12 bg-[#0d0e11]/95 shadow-2xl shadow-black/50">
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#77716a]">
                  Course workspace
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7ed7a5]">
                  <span className="size-2 bg-[#7ed7a5]" />
                  Ready
                </div>
              </div>

              <div className="grid md:grid-cols-[210px_minmax(0,1fr)]">
                <aside className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                    Chapters
                  </p>
                  <div className="grid gap-2">
                    {['Foundations', 'Core concepts', 'Practice lab'].map(
                      (chapter, index) => (
                        <div
                          className={`grid grid-cols-[28px_minmax(0,1fr)] gap-3 border p-3 ${
                            index === 1
                              ? 'border-[#7ed7a5]/35 bg-[#7ed7a5]/10'
                              : 'border-white/10 bg-white/[0.025]'
                          }`}
                          key={chapter}
                        >
                          <span className="flex size-7 items-center justify-center border border-white/10 bg-black/20 font-mono text-[10px] text-[#8f9aff]">
                            0{index + 1}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-[#d8d2ca]">
                              {chapter}
                            </span>
                            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#77716a]">
                              ready
                            </span>
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </aside>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-[#7887ff]/30 bg-[#7887ff]/10 text-[#aab2ff]">
                      Chapter 2
                    </Badge>
                    <Badge
                      className="border-white/10 bg-white/[0.035] text-[#9d968e]"
                      variant="outline"
                    >
                      4 questions
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold leading-8 text-[#f4f1ea]">
                    A generated lesson with a quiz-ready path.
                  </h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Lesson', FileIcon],
                      ['Quiz', ListChecks],
                      ['Secure route', LockKeyhole],
                    ].map(([label, Icon]) => (
                      <div
                        className="border border-white/10 bg-black/20 p-4"
                        key={label as string}
                      >
                        <Icon className="size-4 text-[#7ed7a5]" />
                        <p className="mt-8 text-sm font-medium text-[#d8d2ca]">
                          {label as string}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border border-white/10 bg-black/25 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#f4f1ea]">
                      <CheckCircle2 className="size-4 text-[#7ed7a5]" />
                      Current base flow
                    </div>
                    <p className="text-sm leading-6 text-[#aaa39b]">
                      Topic to course, course to lesson, lesson to quiz.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/10 px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <article
              className="group border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-[#7ed7a5]/35 hover:bg-[#7ed7a5]/[0.07]"
              key={item.title}
            >
              <item.icon className="size-5 text-[#7ed7a5]" />
              <h2 className="mt-10 text-xl font-semibold text-[#f4f1ea]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#918a82]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#f4f1ea]">
              Build the next course.
            </h2>
            <p className="mt-2 text-sm text-[#918a82]">
              Course planner, lesson builder, and quiz workspace are connected.
            </p>
          </div>
          <Button
            asChild
            className="h-10 bg-[#f4f1ea] text-black hover:bg-white"
          >
            <Link href="/create">
              Create course
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function FileIcon(props: React.ComponentProps<typeof Layers3>) {
  return <Layers3 {...props} />;
}
