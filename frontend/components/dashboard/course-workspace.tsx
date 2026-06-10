'use client';

import { GenerateLessonButton } from '@/components/dashboard/generate-lesson-button';
import { Badge } from '@/components/ui/badge';
import type {
  LessonCitation,
  LessonQuiz,
  LessonResource,
  QuizQuestion,
} from '@/lib/schemas/lesson.schema';
import {
  BookOpenText,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  ListChecks,
  Target,
} from 'lucide-react';
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
  learningMode: string | null;
  preferredStyle: string | null;
  weeklyCommitment: number | null;
  finalProject: string | null;
  status: string;
  progress: number;
  experienceLevel: string;
  chapters: CourseWorkspaceChapter[];
};

type MarkdownBlock =
  | {
      type: 'heading';
      level: number;
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      items: string[];
    }
  | {
      type: 'code';
      text: string;
    };

export function CourseWorkspace({ course }: { course: CourseWorkspaceCourse }) {
  const firstReadyChapter =
    course.chapters.find((chapter) => chapter.content)?.id ??
    course.chapters[0]?.id;
  const [selectedChapterId, setSelectedChapterId] = useState(firstReadyChapter);

  const selectedChapter =
    course.chapters.find((chapter) => chapter.id === selectedChapterId) ??
    course.chapters[0];
  const readyChapters = course.chapters.filter((chapter) =>
    Boolean(chapter.content),
  ).length;
  const totalDuration = course.chapters.reduce(
    (total, chapter) => total + (chapter.estimatedDuration ?? 0),
    0,
  );

  const selectedOutcomes = useMemo(
    () => asStringArray(selectedChapter?.learningOutcomes),
    [selectedChapter?.learningOutcomes],
  );
  const selectedQuiz = useMemo(
    () => getQuiz(selectedChapter?.quizJson),
    [selectedChapter?.quizJson],
  );
  const selectedResources = useMemo(
    () => getResources(selectedChapter?.resourcesJson),
    [selectedChapter?.resourcesJson],
  );
  const selectedCitations = useMemo(
    () => getCitations(selectedChapter?.citationsJson),
    [selectedChapter?.citationsJson],
  );

  if (!selectedChapter) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f4f1ea]">
      <div className="mx-auto w-full max-w-[1480px] px-[clamp(1rem,2.4vw,2.5rem)] py-5">
        <header className="grid gap-5 border-b border-white/10 pb-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[#7887ff]/30 bg-[#7887ff]/10 text-[#aab2ff]">
                {course.status.toLowerCase()}
              </Badge>
              <Badge
                className="border-white/10 bg-white/[0.035] text-[#9d968e]"
                variant="outline"
              >
                {course.experienceLevel.toLowerCase()}
              </Badge>
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-[#f4f1ea] sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#aaa39b]">
              {course.description}
            </p>
          </div>

          <aside className="grid gap-3">
            <div className="grid grid-cols-4 border border-white/10 bg-white/[0.025]">
              <Metric label="chapters" value={course.chapters.length} />
              <Metric label="ready" value={readyChapters} />
              <Metric label="progress" value={`${course.progress}%`} />
              <Metric
                label="minutes"
                value={totalDuration > 0 ? totalDuration : '--'}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <CourseFact
                icon={<Target className="size-4" />}
                label="goal"
                value={course.goal ?? 'Not set'}
              />
              <CourseFact
                icon={<GraduationCap className="size-4" />}
                label="mode"
                value={course.learningMode ?? 'Not set'}
              />
              <CourseFact
                icon={<BookOpenText className="size-4" />}
                label="style"
                value={course.preferredStyle ?? 'Not set'}
              />
              <CourseFact
                icon={<Clock3 className="size-4" />}
                label="weekly"
                value={
                  course.weeklyCommitment
                    ? `${course.weeklyCommitment} hours`
                    : 'Not set'
                }
              />
            </div>
          </aside>
        </header>

        <section className="py-5">
          <div className="mb-4 border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[#f4f1ea]">Chapters</h2>
              <Badge
                className="border-white/10 bg-black/20 text-[#9d968e]"
                variant="outline"
              >
                {readyChapters}/{course.chapters.length}
              </Badge>
            </div>

            <div
              className="flex gap-2 overflow-x-auto pb-1"
              role="tablist"
            >
              {course.chapters.map((chapter) => {
                const isSelected = chapter.id === selectedChapter.id;

                return (
                  <button
                    aria-selected={isSelected}
                    className={`grid min-w-[220px] grid-cols-[32px_minmax(0,1fr)] gap-3 border p-3 text-left transition-all sm:min-w-[260px] ${
                      isSelected
                        ? 'border-[#7887ff]/40 bg-[#7887ff]/12'
                        : 'border-white/10 bg-black/20 hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]'
                    }`}
                    key={chapter.id}
                    onClick={() => setSelectedChapterId(chapter.id)}
                    role="tab"
                    type="button"
                  >
                    <span className="flex size-8 items-center justify-center border border-white/10 bg-white/[0.035] font-mono text-xs text-[#8f9aff]">
                      {String(chapter.order).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-[#d8d2ca]">
                        {chapter.title}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#77716a]">
                        {chapter.status.toLowerCase()}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <article className="border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[#8f9aff]">
                      Chapter {selectedChapter.order}
                    </span>
                    <Badge
                      className="border-white/10 bg-black/20 text-[#9d968e]"
                      variant="outline"
                    >
                      {selectedChapter.status.toLowerCase()}
                    </Badge>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-normal text-[#f4f1ea]">
                    {selectedChapter.title}
                  </h2>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-[#9d968e]">
                    {selectedChapter.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedQuiz && (
                    <Link
                      className="inline-flex h-9 items-center justify-center gap-2 border border-white/12 bg-white/[0.035] px-3 text-sm font-medium text-[#d8d2ca] transition-colors hover:bg-white/[0.075] hover:text-white"
                      href={`/dashboard/courses/${course.id}/chapters/${selectedChapter.id}/quiz`}
                    >
                      <ListChecks className="size-4" />
                      Quiz
                    </Link>
                  )}
                  <GenerateLessonButton
                    chapterId={selectedChapter.id}
                    courseId={course.id}
                    hasContent={Boolean(selectedChapter.content)}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ArtifactStatus
                  label="lesson"
                  ready={Boolean(selectedChapter.content)}
                  value={selectedChapter.content ? 'ready' : 'pending'}
                />
                <ArtifactStatus
                  label="quiz"
                  ready={Boolean(selectedQuiz)}
                  value={
                    selectedQuiz
                      ? `${selectedQuiz.questions.length} questions`
                      : 'pending'
                  }
                />
                <ArtifactStatus
                  label="resources"
                  ready={selectedResources.length > 0}
                  value={selectedResources.length}
                />
                <ArtifactStatus
                  label="citations"
                  ready={selectedCitations.length > 0}
                  value={selectedCitations.length}
                />
              </div>
            </div>

            {selectedOutcomes.length > 0 && (
              <section className="border-b border-white/10 p-5">
                <SectionTitle
                  icon={<CheckCircle2 className="size-4" />}
                  title="Outcomes"
                />
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedOutcomes.map((outcome) => (
                    <li
                      className="border border-white/10 bg-black/20 p-3 text-sm leading-6 text-[#b8b1a8]"
                      key={outcome}
                    >
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {selectedChapter.content && (
              <section className="border-b border-white/10 p-5">
                <SectionTitle icon={<FileText className="size-4" />} title="Lesson" />
                <LessonMarkdown content={selectedChapter.content} />
              </section>
            )}

            {selectedChapter.projectTask && (
              <section className="border-b border-white/10 p-5">
                <SectionTitle icon={<Target className="size-4" />} title="Project" />
                <p className="mt-4 text-sm leading-7 text-[#b8b1a8]">
                  {selectedChapter.projectTask}
                </p>
              </section>
            )}

            {(selectedResources.length > 0 || selectedCitations.length > 0) && (
              <section className="grid gap-5 p-5 lg:grid-cols-2">
                {selectedResources.length > 0 && (
                  <ReferenceList
                    items={selectedResources.map((resource) => ({
                      title: resource.title,
                      meta: resource.type,
                      body: resource.reason,
                    }))}
                    title="Resources"
                  />
                )}

                {selectedCitations.length > 0 && (
                  <ReferenceList
                    items={selectedCitations.map((citation) => ({
                      title: citation.label,
                      meta: 'citation',
                      body: citation.note,
                    }))}
                    title="Citations"
                  />
                )}
              </section>
            )}

            {course.finalProject && (
              <section className="border-t border-white/10 p-5">
                <SectionTitle
                  icon={<Layers3 className="size-4" />}
                  title="Final project"
                />
                <p className="mt-4 text-sm leading-7 text-[#b8b1a8]">
                  {course.finalProject}
                </p>
              </section>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border-r border-white/10 p-3 last:border-r-0">
      <p className="font-mono text-xl text-[#f4f1ea]">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8f9aff]">
        {label}
      </p>
    </div>
  );
}

function CourseFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#77716a]">
        <span className="text-[#8f9aff]">{icon}</span>
        {label}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#d8d2ca]">
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#8f9aff]">{icon}</span>
      <h3 className="text-sm font-semibold text-[#f4f1ea]">{title}</h3>
    </div>
  );
}

function ArtifactStatus({
  label,
  ready,
  value,
}: {
  label: string;
  ready: boolean;
  value: number | string;
}) {
  return (
    <div className="border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77716a]">
          {label}
        </p>
        <span
          className={
            ready
              ? 'size-2 bg-[#7ed7a5]'
              : 'size-2 border border-white/20 bg-transparent'
          }
        />
      </div>
      <p className="mt-2 text-sm font-medium text-[#f4f1ea]">{value}</p>
    </div>
  );
}

function LessonMarkdown({ content }: { content: string }) {
  const blocks = parseMarkdown(content);

  return (
    <div className="mt-5 space-y-4 text-sm leading-7 text-[#b8b1a8]">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          const HeadingTag = block.level <= 2 ? 'h3' : 'h4';

          return (
            <HeadingTag
              className="pt-3 text-lg font-semibold leading-snug text-[#f4f1ea]"
              key={`${block.type}-${index}`}
            >
              {renderInline(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === 'list') {
          return (
            <ul
              className="grid gap-2 border-l border-[#7887ff]/30 pl-4"
              key={`${block.type}-${index}`}
            >
              {block.items.map((item) => (
                <li className="text-[#b8b1a8]" key={item}>
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'code') {
          return (
            <pre
              className="overflow-x-auto border border-white/10 bg-black/40 p-4 font-mono text-xs leading-6 text-[#d8d2ca]"
              key={`${block.type}-${index}`}
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        return (
          <p className="max-w-4xl text-[#b8b1a8]" key={`${block.type}-${index}`}>
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function ReferenceList({
  items,
  title,
}: {
  items: {
    title: string;
    meta: string;
    body: string;
  }[];
  title: string;
}) {
  return (
    <div>
      <SectionTitle icon={<BookOpenText className="size-4" />} title={title} />
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article className="border border-white/10 bg-black/20 p-4" key={item.title}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f9aff]">
              {item.meta}
            </p>
            <h4 className="mt-2 text-sm font-semibold text-[#f4f1ea]">
              {item.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-[#9d968e]">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function getQuiz(value: unknown): LessonQuiz | null {
  if (!value || typeof value !== 'object' || !('questions' in value)) {
    return null;
  }

  const questions = (value as { questions: unknown }).questions;

  if (!Array.isArray(questions)) {
    return null;
  }

  const parsedQuestions = questions.filter(isQuizQuestion);

  if (parsedQuestions.length === 0) {
    return null;
  }

  return {
    questions: parsedQuestions,
  };
}

function getResources(value: unknown): LessonResource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isLessonResource);
}

function getCitations(value: unknown): LessonCitation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isLessonCitation);
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as QuizQuestion).question === 'string' &&
    Array.isArray((value as QuizQuestion).options) &&
    typeof (value as QuizQuestion).correct_answer_index === 'number' &&
    typeof (value as QuizQuestion).explanation === 'string' &&
    typeof (value as QuizQuestion).concept === 'string'
  );
}

function isLessonResource(value: unknown): value is LessonResource {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as LessonResource).title === 'string' &&
    typeof (value as LessonResource).type === 'string' &&
    typeof (value as LessonResource).reason === 'string'
  );
}

function isLessonCitation(value: unknown): value is LessonCitation {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    typeof (value as LessonCitation).label === 'string' &&
    typeof (value as LessonCitation).note === 'string'
  );
}

function parseMarkdown(content: string): MarkdownBlock[] {
  const lines = content.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraph.join(' '),
      });
      paragraph = [];
    }
  }

  function flushList() {
    if (list.length > 0) {
      blocks.push({
        type: 'list',
        items: list,
      });
      list = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCode) {
        blocks.push({
          type: 'code',
          text: code.join('\n'),
        });
        code = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      continue;
    }

    const listMatch =
      trimmed.match(/^[-*]\s+(.+)$/) ?? trimmed.match(/^\d+\.\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      list.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (code.length > 0) {
    blocks.push({
      type: 'code',
      text: code.join('\n'),
    });
  }

  return blocks;
}

function renderInline(text: string) {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-semibold text-[#f4f1ea]" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          className="border border-white/10 bg-white/[0.055] px-1.5 py-0.5 font-mono text-xs text-[#d8d2ca]"
          key={`${part}-${index}`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}
