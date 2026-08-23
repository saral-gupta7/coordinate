'use client';

import { GenerateLessonButton } from '@/components/dashboard/generate-lesson-button';
import { ModeToggle } from '@/components/theme-toggle';
import type { LessonCitation, LessonQuiz, LessonResource, QuizQuestion } from '@/lib/schemas/lesson.schema';
import { BookOpen, Check, ChevronRight, Clock3, List, ListChecks, Menu, Target, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export type CourseWorkspaceChapter = {
  id: string;
  title: string;
  description: string;
  content: string | null;
  quizJson: unknown;
  citationsJson: unknown;
  resourcesJson: unknown;
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
  finalProject: string | null;
  status: string;
  progress: number;
  experienceLevel: string;
  chapters: CourseWorkspaceChapter[];
};

export type ChapterNavItem = Pick<CourseWorkspaceChapter, 'id' | 'order' | 'status' | 'title'>;

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
        <Link className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--ink)]" href="/dashboard#courses">
          ← All courses
        </Link>
        <h2 className="mt-5 text-sm font-semibold">Course chapters</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3" aria-label="Course chapters">
        {chapters.map((chapter) => {
          const active = chapter.id === activeId;
          const content = (
            <>
              <span className={`grid size-8 shrink-0 place-items-center rounded-full border text-[11px] ${active ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)]' : 'text-[var(--muted)]'}`}>
                {String(chapter.order).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-5">{chapter.title}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">{chapter.status.toLowerCase()}</span>
              </span>
            </>
          );
          const className = `focus-ring flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-[var(--surface)] shadow-sm' : 'hover:bg-[var(--surface)]'}`;

          return onSelect ? (
            <button className={className} key={chapter.id} onClick={() => onSelect(chapter.id)} type="button">{content}</button>
          ) : (
            <Link className={className} href={`/courses/${courseId}?chapter=${chapter.id}`} key={chapter.id}>{content}</Link>
          );
        })}
      </nav>
    </div>
  );
}

export function CourseWorkspace({ course, initialChapterId }: { course: CourseWorkspaceCourse; initialChapterId?: string }) {
  const firstReady = course.chapters.find((chapter) => chapter.content)?.id ?? course.chapters[0]?.id;
  const [selectedId, setSelectedId] = useState(
    course.chapters.some((chapter) => chapter.id === initialChapterId) ? initialChapterId : firstReady,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const chapter = course.chapters.find((item) => item.id === selectedId) ?? course.chapters[0];
  const outcomes = useMemo(() => asStringArray(chapter?.learningOutcomes), [chapter?.learningOutcomes]);
  const quiz = useMemo(() => getQuiz(chapter?.quizJson), [chapter?.quizJson]);
  const resources = useMemo(() => getResources(chapter?.resourcesJson), [chapter?.resourcesJson]);
  const citations = useMemo(() => getCitations(chapter?.citationsJson), [chapter?.citationsJson]);

  if (!chapter) return null;

  function selectChapter(id: string) {
    setSelectedId(id);
    setDrawerOpen(false);
  }

  return (
    <main className="min-h-svh bg-[var(--canvas)] text-[var(--ink)]">
      <div className="grid min-h-svh lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh border-r lg:block">
          <ChapterPanel activeId={chapter.id} chapters={course.chapters} courseId={course.id} onSelect={selectChapter} />
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex h-17 items-center justify-between border-b bg-[color-mix(in_srgb,var(--canvas)_90%,transparent)] px-5 backdrop-blur-xl sm:px-8">
            <button className="focus-ring inline-flex size-10 items-center justify-center rounded-full border bg-[var(--surface)] lg:hidden" onClick={() => setDrawerOpen(true)} type="button"><Menu className="size-4" /><span className="sr-only">Open chapters</span></button>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)] sm:block">{course.experienceLevel.toLowerCase()} · {course.courseDepth.toLowerCase().replace('_', ' ')}</p>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
              <Link className="focus-ring rounded-full border bg-[var(--surface)] px-4 py-2 text-xs font-semibold" href="/dashboard">Dashboard</Link>
            </div>
          </header>

          <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:py-18">
            <header className="border-b pb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">Chapter {chapter.order} of {course.chapters.length}</p>
              <h1 className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-semibold leading-[0.96] tracking-[-0.06em]">{chapter.title}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)]">{chapter.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-soft)] px-3.5 py-2 text-xs text-[var(--muted)]"><Clock3 className="size-3.5" />{chapter.estimatedDuration ?? '—'} min</span>
                {quiz && <Link className="focus-ring inline-flex items-center gap-2 rounded-full border bg-[var(--surface)] px-4 py-2 text-xs font-semibold hover:border-[var(--accent)]" href={`/courses/${course.id}/chapters/${chapter.id}/quiz`}><ListChecks className="size-4" />Take quiz</Link>}
                <GenerateLessonButton chapterId={chapter.id} courseId={course.id} hasContent={Boolean(chapter.content)} />
              </div>
            </header>

            {outcomes.length > 0 && (
              <section className="border-b py-9">
                <SectionHeading icon={<Target className="size-4" />} title="What you will learn" />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {outcomes.map((outcome) => <p className="flex gap-3 text-sm leading-6 text-[var(--muted)]" key={outcome}><Check className="mt-1 size-4 shrink-0 text-[var(--accent-strong)]" />{outcome}</p>)}
                </div>
              </section>
            )}

            <section className="py-10">
              {chapter.content ? <LessonContent content={chapter.content} /> : (
                <div className="rounded-[24px] border border-dashed p-10 text-center">
                  <BookOpen className="mx-auto size-6 text-[var(--accent-strong)]" />
                  <h2 className="mt-5 text-xl font-semibold">This chapter is planned.</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">Generate its lesson when you are ready to study it.</p>
                </div>
              )}
            </section>

            {chapter.projectTask && <InfoSection title="Practice task" body={chapter.projectTask} />}
            {course.finalProject && <InfoSection title="Course project" body={course.finalProject} />}

            {(resources.length > 0 || citations.length > 0) && (
              <section className="grid gap-8 border-t py-10 sm:grid-cols-2">
                <ReferenceList title="Resources" items={resources.map((item) => [item.title, item.reason])} />
                <ReferenceList title="Citations" items={citations.map((item) => [item.label, item.note])} />
              </section>
            )}

            <footer className="mt-8 flex justify-end border-t pt-8">
              {course.chapters[chapter.order] && (
                <button className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--surface)]" onClick={() => selectChapter(course.chapters[chapter.order].id)} type="button">Next chapter <ChevronRight className="size-4" /></button>
              )}
            </footer>
          </article>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close chapter drawer" className="absolute inset-0 bg-black/55" onClick={() => setDrawerOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,320px)] border-r bg-[var(--surface-soft)] shadow-2xl">
            <button className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border bg-[var(--surface)]" onClick={() => setDrawerOpen(false)} type="button"><X className="size-4" /></button>
            <ChapterPanel activeId={chapter.id} chapters={course.chapters} courseId={course.id} onSelect={selectChapter} />
          </aside>
        </div>
      )}
    </main>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{icon}{title}</div>;
}

function LessonContent({ content }: { content: string }) {
  return (
    <div className="space-y-5 text-base leading-8 text-[var(--muted)]">
      {content.split(/\n{2,}/).map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('### ')) return <h3 className="pt-6 text-2xl font-semibold tracking-[-0.035em] text-[var(--ink)]" key={index}>{trimmed.slice(4)}</h3>;
        if (trimmed.startsWith('## ')) return <h2 className="pt-7 text-3xl font-semibold tracking-[-0.045em] text-[var(--ink)]" key={index}>{trimmed.slice(3)}</h2>;
        if (trimmed.startsWith('# ')) return <h2 className="pt-7 text-3xl font-semibold tracking-[-0.045em] text-[var(--ink)]" key={index}>{trimmed.slice(2)}</h2>;
        if (trimmed.split('\n').every((line) => /^[-*]\s/.test(line))) {
          return <ul className="space-y-2 border-l-2 border-[var(--accent)] pl-5" key={index}>{trimmed.split('\n').map((line) => <li key={line}>{line.replace(/^[-*]\s/, '')}</li>)}</ul>;
        }
        return <p key={index}>{trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
      })}
    </div>
  );
}

function InfoSection({ body, title }: { body: string; title: string }) {
  return <section className="border-t py-9"><SectionHeading icon={<List className="size-4" />} title={title} /><p className="mt-5 text-sm leading-7 text-[var(--muted)]">{body}</p></section>;
}

function ReferenceList({ items, title }: { items: [string, string][]; title: string }) {
  return <div><SectionHeading icon={<BookOpen className="size-4" />} title={title} /><div className="mt-5 space-y-4">{items.map(([name, body]) => <div key={name}><h3 className="text-sm font-semibold">{name}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{body}</p></div>)}</div></div>;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function getQuiz(value: unknown): LessonQuiz | null {
  if (!value || typeof value !== 'object' || !('questions' in value)) return null;
  const questions = (value as { questions: unknown }).questions;
  if (!Array.isArray(questions)) return null;
  const parsed = questions.filter(isQuizQuestion);
  return parsed.length ? { questions: parsed } : null;
}

function getResources(value: unknown): LessonResource[] {
  return Array.isArray(value) ? value.filter((item): item is LessonResource => Boolean(item) && typeof item === 'object' && typeof (item as LessonResource).title === 'string' && typeof (item as LessonResource).reason === 'string') : [];
}

function getCitations(value: unknown): LessonCitation[] {
  return Array.isArray(value) ? value.filter((item): item is LessonCitation => Boolean(item) && typeof item === 'object' && typeof (item as LessonCitation).label === 'string' && typeof (item as LessonCitation).note === 'string') : [];
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  return Boolean(value) && typeof value === 'object' && typeof (value as QuizQuestion).question === 'string' && Array.isArray((value as QuizQuestion).options) && typeof (value as QuizQuestion).correct_answer_index === 'number';
}
