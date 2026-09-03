'use client';

import { CourseSources } from '@/components/dashboard/course-sources';
import { GenerateLessonButton } from '@/components/dashboard/generate-lesson-button';
import { ModeToggle } from '@/components/theme-toggle';
import type { LessonQuiz, QuizQuestion } from '@/lib/schemas/lesson.schema';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  List,
  ListChecks,
  Menu,
  Target,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type CourseWorkspaceChapter = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  quizJson: unknown;
  projectTask: string | null;
  status: string;
  estimatedDuration: number | null;
  learningOutcomes: unknown;
  order: number;
};

export type CourseWorkspaceCourse = {
  id: string;
  title: string;
  description: string;
  goal: string | null;
  courseDepth: string;
  status: string;
  progress: number;
  experienceLevel: string;
  chapters: CourseWorkspaceChapter[];
};

async function fetchCourseChapter(
  courseId: string,
  chapterId: string,
): Promise<CourseWorkspaceChapter> {
  const response = await fetch(
    `/api/courses/${courseId}/chapters/${chapterId}`,
  );

  if (!response.ok) {
    throw new Error('Could not load this chapter.');
  }

  const data = (await response.json()) as {
    chapter: CourseWorkspaceChapter;
  };

  return data.chapter;
}

export function useCourseChapter(
  courseId: string,
  chapterId: string | undefined,
  initialChapter: CourseWorkspaceChapter | undefined,
) {
  return useQuery<CourseWorkspaceChapter>({
    queryKey: ['course-chapter', courseId, chapterId],
    queryFn: () => {
      if (!chapterId) {
        throw new Error('Chapter ID is required.');
      }

      return fetchCourseChapter(courseId, chapterId);
    },
    enabled: Boolean(chapterId),
    initialData: chapterId === initialChapter?.id ? initialChapter : undefined,
    placeholderData: (previousChapter) => previousChapter,
    staleTime: 60_000,
  });
}

export type ChapterNavItem = Pick<
  CourseWorkspaceChapter,
  'id' | 'order' | 'status' | 'title'
>;

export type CourseWorkspaceSummary = Omit<CourseWorkspaceCourse, 'chapters'> & {
  chapters: ChapterNavItem[];
};

export function ChapterPanel({
  activeId,
  chapters,
  courseId,
  onSelect,
}: {
  activeId: string;
  chapters: ChapterNavItem[];
  courseId: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col bg-[var(--surface-soft)]">
      <div className="border-b px-6 py-6">
        <Link
          className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)]"
          href="/dashboard#courses"
        >
          ← All courses
        </Link>
        <h2 className="mt-5 text-sm font-semibold">Course chapters</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Course chapters">
        {chapters.map((chapter) => {
          const active = chapter.id === activeId;
          const content = (
            <>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border text-[11px] ${active ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]' : 'text-[var(--muted)]'}`}
              >
                {String(chapter.order).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-5">
                  {chapter.title}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                  {chapter.status.toLowerCase()}
                </span>
              </span>
            </>
          );
          const className = `focus-ring flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-[var(--surface)] shadow-sm' : 'hover:bg-[var(--surface)]'}`;

          return onSelect ? (
            <button
              className={className}
              key={chapter.id}
              onClick={() => onSelect(chapter.id)}
              type="button"
            >
              {content}
            </button>
          ) : (
            <Link
              className={className}
              href={`/courses/${courseId}?chapter=${chapter.id}`}
              key={chapter.id}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function CourseWorkspace({
  course,
  initialChapter,
}: {
  course: CourseWorkspaceSummary;
  initialChapter: CourseWorkspaceChapter | null;
}) {
  const [selectedId, setSelectedId] = useState(initialChapter?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const chapterQuery = useCourseChapter(
    course.id,
    selectedId,
    initialChapter ?? undefined,
  );

  const chapter = chapterQuery.data ?? initialChapter;

  const outcomes = useMemo(
    () => asStringArray(chapter?.learningOutcomes),
    [chapter?.learningOutcomes],
  );
  const quiz = useMemo(() => getQuiz(chapter?.quizJson), [chapter?.quizJson]);
  if (!chapter) return null;

  function selectChapter(id: string) {
    setSelectedId(id);
    setDrawerOpen(false);
  }

  return (
    <main className="min-h-svh bg-(--canvas) text-(--ink)">
      <div className="grid min-h-svh lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh border-r lg:block">
          <ChapterPanel
            activeId={selectedId ?? chapter.id}
            chapters={course.chapters}
            courseId={course.id}
            onSelect={selectChapter}
          />
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-[color-mix(in_srgb,var(--canvas)_90%,transparent)] px-4 backdrop-blur-xl sm:h-17 sm:px-8">
            <button
              className="focus-ring inline-flex size-10 items-center justify-center rounded-full border bg-(--surface) lg:hidden"
              onClick={() => setDrawerOpen(true)}
              type="button"
            >
              <Menu className="size-4" />
              <span className="sr-only">Open chapters</span>
            </button>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-(--muted) sm:block">
              {course.experienceLevel.toLowerCase()} ·{' '}
              {course.courseDepth.toLowerCase().replace('_', ' ')}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <Link
                className="focus-ring rounded-full border bg-(--surface) px-3.5 py-2 text-xs font-semibold sm:px-4"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </div>
          </header>

          <article className="mx-auto max-w-4xl px-4 py-9 sm:px-8 sm:py-12 lg:py-18">
            <header className="border-b pb-8 sm:pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--accent-strong)">
                Chapter {chapter.order} of {course.chapters.length}
              </p>
              <h1 className="mt-5 text-balance text-[clamp(2.2rem,11vw,5rem)] font-semibold leading-1 tracking-[-0.055em] sm:leading-[0.96] sm:tracking-[-0.06em]">
                {chapter.title}
              </h1>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-(--muted) sm:mt-6 sm:text-base sm:leading-8">
                {chapter.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-(--surface-soft) px-3.5 py-2 text-xs text-(--muted)">
                  <Clock3 className="size-3.5" />
                  {chapter.estimatedDuration ?? '—'} min
                </span>
                {quiz && (
                  <Link
                    className="focus-ring inline-flex items-center gap-2 rounded-full border bg-(--surface) px-4 py-2 text-xs font-semibold hover:border-(--accent)"
                    href={`/courses/${course.id}/chapters/${chapter.id}/quiz`}
                  >
                    <ListChecks className="size-4" />
                    Take quiz
                  </Link>
                )}
                <GenerateLessonButton
                  chapterId={chapter.id}
                  courseId={course.id}
                  hasContent={Boolean(chapter.content)}
                />
              </div>
            </header>

            <CourseSources courseId={course.id} />

            {outcomes.length > 0 && (
              <section className="border-b py-8 sm:py-9">
                <SectionHeading
                  icon={<Target className="size-4" />}
                  title="What you will learn"
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {outcomes.map((outcome) => (
                    <p
                      className="flex gap-3 text-sm leading-6 text-(--muted)"
                      key={outcome}
                    >
                      <Check className="mt-1 size-4 shrink-0 text-(--accent-strong)" />
                      {outcome}
                    </p>
                  ))}
                </div>
              </section>
            )}

            <section className="py-8 sm:py-10">
              {chapter.content ? (
                <LessonContent content={chapter.content} />
              ) : (
                <div className="rounded-[22px] border border-dashed p-7 text-center sm:rounded-[24px] sm:p-10">
                  <BookOpen className="mx-auto size-6 text-(--accent-strong)" />
                  <h2 className="mt-5 text-xl font-semibold">
                    This chapter is planned.
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--muted)">
                    Generate its lesson when you are ready to study it.
                  </p>
                </div>
              )}
            </section>

            {chapter.projectTask && (
              <InfoSection title="Practice task" body={chapter.projectTask} />
            )}

            <footer className="mt-8 flex justify-end border-t pt-8">
              {course.chapters[chapter.order] && (
                <button
                  className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--ink) px-5 py-3 text-sm font-semibold text-(--surface) sm:w-auto"
                  onClick={() =>
                    selectChapter(course.chapters[chapter.order].id)
                  }
                  type="button"
                >
                  Next chapter <ChevronRight className="size-4" />
                </button>
              )}
            </footer>
          </article>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close chapter drawer"
            className="absolute inset-0 bg-black/55"
            onClick={() => setDrawerOpen(false)}
            type="button"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(92vw,340px)] border-r bg-(--surface-soft) shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border bg-(--surface)"
              onClick={() => setDrawerOpen(false)}
              type="button"
            >
              <X className="size-4" />
            </button>
            <ChapterPanel
              activeId={selectedId ?? chapter.id}
              chapters={course.chapters}
              courseId={course.id}
              onSelect={selectChapter}
            />
          </aside>
        </div>
      )}
    </main>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--accent-strong)">
      {icon}
      {title}
    </div>
  );
}

function LessonContent({ content }: { content: string }) {
  return (
    <div className="lesson-content">
      <ReactMarkdown
        components={{
          a: (props) => <a {...props} rel="noreferrer" target="_blank" />,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function InfoSection({ body, title }: { body: string; title: string }) {
  return (
    <section className="border-t py-9">
      <SectionHeading icon={<List className="size-4" />} title={title} />
      <p className="mt-5 text-sm leading-7 text-(--muted)">{body}</p>
    </section>
  );
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function getQuiz(value: unknown): LessonQuiz | null {
  if (!value || typeof value !== 'object' || !('questions' in value))
    return null;
  const questions = (value as { questions: unknown }).questions;
  if (!Array.isArray(questions)) return null;
  const parsed = questions.filter(isQuizQuestion);
  return parsed.length ? { questions: parsed } : null;
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as QuizQuestion).question === 'string' &&
    Array.isArray((value as QuizQuestion).options) &&
    typeof (value as QuizQuestion).correct_answer_index === 'number'
  );
}
