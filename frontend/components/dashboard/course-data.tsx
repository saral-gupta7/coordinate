'use client';

import {
  acceptCoursePlanAction,
  generateCoursePlanAction,
  reviseCoursePlanAction,
} from '@/lib/actions/create.action';
import { authClient } from '@/lib/auth-client';
import type {
  CourseBlueprint,
  CoursePlanResponse,
} from '@/lib/schemas/course.schema';
import { createCourseSchema } from '@/lib/schemas/course.schema';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

export type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  courseDepth: string;
  experienceLevel: string;
  updatedAt: string;
  _count: { chapters: number };
};

type CoursesResponse = { courses: DashboardCourse[] };
type FormValues = z.infer<typeof createCourseSchema>;
type Draft = CoursePlanResponse & { course: CourseBlueprint };
type PlannerError = { title: string; detail?: string };
type PendingAction = 'generating' | 'revising' | 'saving' | null;

function useCourses() {
  return useQuery<CoursesResponse>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Could not load your courses.');
      return response.json();
    },
  });
}

const coverSchemes = [
  ['#dcd8ff', '#17152e'],
  ['#f8d7c9', '#35150d'],
  ['#cce9df', '#10261f'],
  ['#f2e4b8', '#2c2208'],
  ['#d3e0f4', '#101d33'],
] as const;

const promptStarters = [
  {
    label: 'Build a practical skill',
    prompt:
      'Create a practical SQL course for analytics. I know spreadsheets but have never used a database. Help me confidently query real datasets.',
  },
  {
    label: 'Prepare for a role',
    prompt:
      'Prepare me for a junior frontend developer role. I know basic HTML and CSS and want project-based practice with React and TypeScript.',
  },
  {
    label: 'Understand a subject',
    prompt:
      'Teach me the fundamentals of personal finance as a beginner. I want to understand budgeting, emergency funds, investing, and common risks.',
  },
] as const;

function hash(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function CourseCover({ course }: { course: DashboardCourse }) {
  const [background, foreground] =
    coverSchemes[hash(course.id) % coverSchemes.length];
  const words = course.title.split(/\s+/);

  return (
    <div
      className="relative aspect-16/10 overflow-hidden rounded-[22px] p-5 transition duration-300 group-hover:-translate-y-1"
      style={{ background, color: foreground }}
    >
      <div className="absolute -right-12 -top-16 size-48 rounded-full border border-current opacity-20" />
      <div className="absolute -bottom-20 -left-10 size-48 rounded-full border border-current opacity-20" />
      <div className="absolute inset-x-5 top-11 h-px bg-current opacity-15" />
      <p className="relative text-[10px] font-medium uppercase tracking-[0.2em]">
        Coordinate / {course.experienceLevel.toLowerCase()}
      </p>
      <p className="relative mt-9 max-w-[85%] text-[clamp(1.35rem,2.2vw,2.4rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
        {words.slice(0, 6).join(' ')}
      </p>
      <div className="absolute bottom-5 right-5 grid size-10 place-items-center rounded-full border border-current">
        <ArrowUpRight className="size-4" />
      </div>
    </div>
  );
}

export function DashboardWorkspace() {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const { data, error, isPending } = useCourses();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [requestPrompt, setRequestPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [plannerError, setPlannerError] = useState<PlannerError | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [revisionNumber, setRevisionNumber] = useState(1);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<FormValues>({ defaultValues: { prompt: '' } });

  async function submit(values: FormValues) {
    setPendingAction('generating');
    setPlannerError(null);
    const result = await generateCoursePlanAction(values);
    setPendingAction(null);

    if (!result.ok) {
      setPlannerError({ title: result.error, detail: result.detail });
      requestAnimationFrame(() => {
        document.querySelector('#course-planner-error')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
      return;
    }

    setDraft(result.data);
    setRequestPrompt(values.prompt);
    setFeedback('');
    setFeedbackError('');
    setRevisionNumber(1);
    requestAnimationFrame(() => {
      document.querySelector('#curriculum-review')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  async function reviseCurriculum() {
    if (!draft) return;
    if (feedback.trim().length < 5) {
      setFeedbackError('Describe the changes you would like to see.');
      return;
    }

    setPendingAction('revising');
    setFeedbackError('');
    const result = await reviseCoursePlanAction({
      prompt: requestPrompt,
      course: draft.course,
      feedback,
    });
    setPendingAction(null);

    if (!result.ok) {
      setFeedbackError(result.error);
      return;
    }

    setDraft(result.data);
    setFeedback('');
    setRevisionNumber((current) => current + 1);
    toast.success('Curriculum updated. Review the new draft below.');
  }

  async function acceptCurriculum() {
    if (!draft) return;
    setPendingAction('saving');
    setFeedbackError('');
    const result = await acceptCoursePlanAction({
      prompt: requestPrompt,
      course: draft.course,
    });
    setPendingAction(null);

    if (!result.ok) {
      setFeedbackError(result.error);
      return;
    }

    setDraft(null);
    setRequestPrompt('');
    setFeedback('');
    reset();
    await queryClient.invalidateQueries({ queryKey: ['courses'] });
    toast.success('Curriculum approved and added to your library.');
    document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' });
  }

  function startOver() {
    setDraft(null);
    setRequestPrompt('');
    setFeedback('');
    setFeedbackError('');
    setPlannerError(null);
    reset();
    document.querySelector('#course-composer')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  const courses = data?.courses ?? [];
  const firstName = session?.user.name?.split(' ')[0] ?? 'Learner';
  const isBusy = pendingAction !== null;

  return (
    <div className="dashboard-glow mx-auto min-h-svh max-w-[1540px] px-4 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-9">
      <header className="flex items-center justify-between">
        <div className="max-w-[70vw] truncate rounded-full border bg-[var(--surface)] px-4 py-2 text-sm font-medium shadow-sm sm:max-w-none">
          {session?.user.name ?? 'Your workspace'}
        </div>
        <span className="hidden text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:block">
          Adaptive course studio
        </span>
      </header>

      <section className="scroll-mt-6 py-10 sm:py-16 lg:py-20" id="course-composer">
        <div className="mb-7 max-w-3xl sm:mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
            New learning path
          </p>
          <h1 className="mt-4 text-[clamp(2.35rem,10vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.065em] sm:leading-[0.9]">
            What do you want to learn,
            <span className="editorial-serif block font-medium text-[var(--accent-strong)] sm:ml-3 sm:inline">
              {firstName}?
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Give us the destination, your starting point, and the outcome you
            care about. You stay in control of the curriculum before it is saved.
          </p>
        </div>

        <div className="panel-shadow overflow-hidden rounded-[26px] border bg-[var(--surface)] sm:rounded-[34px]">
          <div className="grid lg:grid-cols-[0.78fr_1.22fr]">
            <div className="order-2 flex flex-col p-5 sm:p-9 lg:order-1 lg:min-h-[610px] lg:p-12">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  <Sparkles className="size-4" />
                  Start with a clear brief
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  01 / 03
                </span>
              </div>

              <div className="mt-8 sm:mt-12">
                <h2 className="max-w-md text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">
                  A useful course starts with useful context.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-[var(--muted)]">
                  Include what you already know, where you want to get, and how
                  you prefer to practice. A few specific sentences are enough.
                </p>
              </div>

              <div className="mt-7 sm:mt-9">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Try a starting point
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {promptStarters.map((starter) => (
                    <button
                      className="focus-ring rounded-full border bg-[var(--surface-soft)] px-3.5 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
                      key={starter.label}
                      onClick={() => {
                        setPlannerError(null);
                        setValue('prompt', starter.prompt, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      type="button"
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3 border-t pt-6 lg:mt-auto lg:pt-7">
                {[
                  ['01', 'Describe'],
                  ['02', 'Review'],
                  ['03', 'Approve'],
                ].map(([number, label]) => (
                  <div key={number}>
                    <span className="font-mono text-[10px] text-[var(--accent-strong)]">{number}</span>
                    <p className="mt-1 text-xs font-medium text-[var(--muted)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 bg-[var(--surface-soft)] p-3 sm:p-6 lg:order-2 lg:border-l lg:p-8">
              <form
                className="flex min-h-[440px] flex-col rounded-[21px] border bg-[var(--surface)] p-4 sm:min-h-[520px] sm:rounded-[26px] sm:p-6"
                onSubmit={handleSubmit(submit)}
              >
                <div className="flex items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm font-semibold">Course brief</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Write naturally. Specific beats formal.</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                    <Sparkles className="size-4" />
                  </span>
                </div>

                <textarea
                  {...register('prompt', {
                    validate: (value) => {
                      const parsed = createCourseSchema.shape.prompt.safeParse(value);
                      return parsed.success || parsed.error.issues[0]?.message;
                    },
                  })}
                  aria-describedby="course-request-error course-planner-error"
                  aria-invalid={Boolean(errors.prompt || plannerError)}
                  aria-label="Course request"
                  className="min-h-56 flex-1 resize-none border-0 bg-transparent px-1 py-5 text-base leading-7 placeholder:text-[var(--muted)] focus:outline-none sm:min-h-72 sm:py-6 sm:text-lg sm:leading-8"
                  placeholder="For example: I want a practical SQL course for analytics. I know spreadsheets but have never used a database. Help me build confidence writing queries for real datasets."
                />

                {plannerError && (
                  <div
                    aria-live="assertive"
                    className="mb-4 flex gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--danger)_35%,var(--line))] bg-[var(--danger-soft)] p-4 text-left"
                    id="course-planner-error"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-[var(--danger)]" />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-[var(--danger)]">
                        {plannerError.title}
                      </p>
                      <p className="mt-1 break-words text-xs leading-5 text-[var(--muted)]">
                        {plannerError.detail ??
                          'Name a subject or skill and tell us what you want to be able to do.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-5 text-[var(--danger)]" id="course-request-error">
                      {errors.prompt?.message}
                    </p>
                    <button
                      className="focus-ring inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-[var(--accent-ink)] shadow-[0_10px_30px_var(--accent-shadow)] transition hover:bg-[var(--accent-strong)] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:hover:-translate-y-0.5"
                      disabled={isBusy}
                      type="submit"
                    >
                      {pendingAction === 'generating' ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      {pendingAction === 'generating' ? 'Building draft…' : 'Create curriculum'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {draft && (
        <CurriculumReview
          draft={draft.course}
          feedback={feedback}
          feedbackError={feedbackError}
          onAccept={acceptCurriculum}
          onFeedbackChange={(value) => {
            setFeedback(value);
            setFeedbackError('');
          }}
          onRevise={reviseCurriculum}
          onStartOver={startOver}
          pendingAction={pendingAction}
          revisionNumber={revisionNumber}
        />
      )}

      <section className="scroll-mt-10 border-t py-11 sm:py-14" id="courses">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
              Library
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              Your courses
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)]">{courses.length} total</p>
        </div>

        {isPending && (
          <div className="h-64 animate-pulse rounded-[24px] bg-[var(--surface-soft)]" />
        )}
        {error && (
          <p className="rounded-xl border p-5 text-[var(--danger)]">
            {error.message}
          </p>
        )}
        {!isPending && !error && courses.length === 0 && (
          <div className="rounded-[24px] border border-dashed p-8 text-center sm:p-12">
            <BookOpen className="mx-auto size-6 text-[var(--accent-strong)]" />
            <h3 className="mt-5 text-xl font-semibold">
              Your first course starts above.
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Approve a curriculum and it will appear here.
            </p>
          </div>
        )}

        <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Link
              className="focus-ring group block rounded-[22px]"
              href={`/courses/${course.id}`}
              key={course.id}
            >
              <CourseCover course={course} />
              <div className="px-1 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold leading-6 tracking-[-0.025em] group-hover:text-[var(--accent-strong)]">
                    {course.title}
                  </h3>
                  <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent-strong)]">
                    {course.progress}%
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-[var(--muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-3.5" />
                    {course._count.chapters} chapters
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-3.5" />
                    {course.courseDepth.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function CurriculumReview({
  draft,
  feedback,
  feedbackError,
  onAccept,
  onFeedbackChange,
  onRevise,
  onStartOver,
  pendingAction,
  revisionNumber,
}: {
  draft: CourseBlueprint;
  feedback: string;
  feedbackError: string;
  onAccept: () => void;
  onFeedbackChange: (value: string) => void;
  onRevise: () => void;
  onStartOver: () => void;
  pendingAction: PendingAction;
  revisionNumber: number;
}) {
  const totalMinutes = draft.chapters.reduce(
    (total, chapter) => total + chapter.estimated_duration,
    0,
  );
  const isBusy = pendingAction !== null;

  return (
    <section
      className="scroll-mt-6 border-t py-12 sm:py-16"
      id="curriculum-review"
    >
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
            Curriculum draft {String(revisionNumber).padStart(2, '0')}
          </p>
          <h2 className="mt-3 max-w-4xl text-[clamp(2.15rem,9vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:leading-[0.94]">
            Review the path before you commit.
          </h2>
        </div>
        <button
          className="focus-ring inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]"
          disabled={isBusy}
          onClick={onStartOver}
          type="button"
        >
          <RefreshCw className="size-3.5" /> Start over
        </button>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="overflow-hidden rounded-[24px] border bg-[var(--surface)] sm:rounded-[28px]">
          <header className="border-b p-5 sm:p-9">
            <div className="flex flex-wrap gap-2">
              <MetaPill label={draft.experience_level} />
              <MetaPill label={draft.course_depth.replace('_', ' ')} />
              <MetaPill label={`${draft.chapters.length} chapters`} />
              <MetaPill label={`${totalMinutes} min`} />
            </div>
            <h3 className="mt-7 text-[clamp(1.8rem,8vw,4rem)] font-semibold leading-[1] tracking-[-0.05em] sm:leading-[0.96]">
              {draft.title}
            </h3>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {draft.description}
            </p>
            <div className="mt-7 rounded-2xl bg-[var(--surface-soft)] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                Learning goal
              </p>
              <p className="mt-2 text-sm leading-6">{draft.goal}</p>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            <p className="px-2 pb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Chapter sequence
            </p>
            <div className="divide-y">
              {draft.chapters.map((chapter) => (
                <article
                  className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 px-1 py-6 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:gap-4 sm:px-2"
                  key={`${chapter.order}-${chapter.title}`}
                >
                  <span className="grid size-11 place-items-center rounded-full border bg-[var(--surface-soft)] font-mono text-xs text-[var(--accent-strong)]">
                    {String(chapter.order).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold tracking-[-0.025em]">
                      {chapter.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {chapter.description}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {chapter.learning_outcomes.map((outcome) => (
                        <li
                          className="flex gap-2 text-xs leading-5 text-[var(--muted)]"
                          key={outcome}
                        >
                          <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--accent-strong)]" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="col-start-2 inline-flex h-fit items-center gap-1.5 text-xs text-[var(--muted)] sm:col-start-auto">
                    <Clock3 className="size-3.5" />
                    {chapter.estimated_duration}m
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-px border-t bg-[var(--line)] md:grid-cols-2">
            <PlanList title="Learning objectives" items={draft.learning_objectives} />
            <PlanList title="Assessment plan" items={draft.assessment_plan} />
            <PlanList
              emptyLabel="No prerequisites"
              title="Prerequisites"
              items={draft.prerequisites}
            />
            <div className="bg-[var(--surface)] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Final project
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                {draft.final_project}
              </p>
            </div>
          </div>
        </div>

        <aside className="panel-shadow rounded-[24px] border bg-[var(--surface)] p-5 sm:rounded-[26px] sm:p-6 xl:sticky xl:top-6">
          <div className="flex size-11 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
            <CheckCircle2 className="size-5" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
            Does this feel right?
          </h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Approve this curriculum to create the course, or describe exactly
            what you want changed. You can revise it as many times as needed.
          </p>

          <button
            className="focus-ring mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--surface)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            disabled={isBusy}
            onClick={onAccept}
            type="button"
          >
            {pendingAction === 'saving' ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            {pendingAction === 'saving' ? 'Creating course…' : 'Use this curriculum'}
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            <span className="h-px flex-1 bg-[var(--line)]" />
            Need changes?
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <label className="text-xs font-semibold" htmlFor="curriculum-feedback">
            Your revision notes
          </label>
          <textarea
            aria-describedby="curriculum-feedback-error"
            aria-invalid={Boolean(feedbackError)}
            className="mt-2 min-h-36 w-full resize-none rounded-2xl border bg-[var(--surface-soft)] p-4 text-sm leading-6 placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:outline-none"
            disabled={isBusy}
            id="curriculum-feedback"
            onChange={(event) => onFeedbackChange(event.target.value)}
            placeholder="Add more hands-on exercises, combine chapters 2 and 3, and make the final project smaller…"
            value={feedback}
          />
          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-xs leading-5 text-[var(--danger)]"
            id="curriculum-feedback-error"
          >
            {feedbackError}
          </p>
          <button
            className="focus-ring mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border bg-[var(--surface)] px-5 text-sm font-semibold transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)] disabled:cursor-wait disabled:opacity-60"
            disabled={isBusy}
            onClick={onRevise}
            type="button"
          >
            {pendingAction === 'revising' ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {pendingAction === 'revising' ? 'Reworking curriculum…' : 'Apply my changes'}
          </button>
        </aside>
      </div>
    </section>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
      {label}
    </span>
  );
}

function PlanList({
  emptyLabel,
  items,
  title,
}: {
  emptyLabel?: string;
  items: string[];
  title: string;
}) {
  return (
    <div className="bg-[var(--surface)] p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
        {title}
      </p>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li className="flex gap-2 text-sm leading-6 text-[var(--muted)]" key={item}>
              <ArrowRight className="mt-1 size-3.5 shrink-0 text-[var(--accent-strong)]" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">{emptyLabel}</p>
      )}
    </div>
  );
}
