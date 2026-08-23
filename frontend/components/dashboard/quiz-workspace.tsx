'use client';

import { ChapterPanel, type ChapterNavItem } from '@/components/dashboard/course-workspace';
import { ModeToggle } from '@/components/theme-toggle';
import type { LessonQuiz, QuizQuestion } from '@/lib/schemas/lesson.schema';
import { ArrowLeft, ArrowRight, Check, Menu, RotateCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type QuizWorkspaceProps = {
  course: { id: string; title: string; chapters: ChapterNavItem[] };
  chapter: { id: string; title: string; order: number; quizJson: unknown };
};

export function QuizWorkspace({ chapter, course }: QuizWorkspaceProps) {
  const quiz = useMemo(() => getQuiz(chapter.quizJson), [chapter.quizJson]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!quiz) {
    return (
      <main className="grid min-h-svh place-items-center bg-[var(--canvas)] p-5">
        <div className="max-w-md rounded-[24px] border bg-[var(--surface)] p-8 text-center">
          <h1 className="text-2xl font-semibold">Quiz unavailable</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">Generate the chapter lesson first to create its quiz.</p>
          <Link className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--surface)]" href={`/courses/${course.id}?chapter=${chapter.id}`}>Return to chapter</Link>
        </div>
      </main>
    );
  }

  const question = quiz.questions[index];
  const selected = answers[index];
  const answered = selected !== undefined;
  const correct = selected === question.correct_answer_index;
  const finished = index === quiz.questions.length - 1 && answered;
  const score = quiz.questions.reduce((total, item, questionIndex) => total + (answers[questionIndex] === item.correct_answer_index ? 1 : 0), 0);

  function restart() {
    setAnswers({});
    setIndex(0);
  }

  return (
    <main className="min-h-svh bg-[var(--canvas)] text-[var(--ink)]">
      <div className="grid min-h-svh lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-svh border-r lg:block">
          <ChapterPanel activeId={chapter.id} chapters={course.chapters} courseId={course.id} />
        </aside>

        <div className="min-w-0">
          <header className="flex h-17 items-center gap-4 border-b px-5 sm:px-8">
            <button className="grid size-10 place-items-center rounded-full border bg-[var(--surface)] lg:hidden" onClick={() => setDrawerOpen(true)} type="button"><Menu className="size-4" /></button>
            <Link className="focus-ring inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)]" href={`/courses/${course.id}?chapter=${chapter.id}`}><ArrowLeft className="size-4" />Chapter</Link>
            <p className="ml-auto hidden max-w-sm truncate text-sm font-medium sm:block">{course.title}</p>
            <ModeToggle />
          </header>

          <section className="mx-auto flex min-h-[calc(100svh-68px)] max-w-4xl flex-col px-5 py-10 sm:px-8 lg:justify-center lg:py-16">
            <div className="mb-8 flex items-center gap-2">
              {quiz.questions.map((_, questionIndex) => (
                <button
                  aria-label={`Question ${questionIndex + 1}`}
                  className={`h-1.5 flex-1 rounded-full transition ${questionIndex <= index ? 'bg-[var(--accent)]' : 'bg-[var(--line)]'}`}
                  key={questionIndex}
                  onClick={() => setIndex(questionIndex)}
                  type="button"
                />
              ))}
            </div>

            <div className="rounded-[28px] border bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-10">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span>Question {index + 1} / {quiz.questions.length}</span>
                <span>{question.concept}</span>
              </div>
              <h1 className="mt-8 max-w-3xl text-[clamp(1.65rem,3.2vw,2.7rem)] font-semibold leading-[1.15] tracking-[-0.045em]">{question.question}</h1>

              <div className="mt-9 grid gap-3">
                {question.options.map((option, optionIndex) => {
                  const isAnswer = optionIndex === question.correct_answer_index;
                  const isSelected = optionIndex === selected;
                  let style = 'border-[var(--line)] hover:border-[var(--accent)]';
                  if (answered && isAnswer) style = 'border-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)]';
                  else if (answered && isSelected) style = 'border-[var(--danger)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]';

                  return (
                    <button className={`focus-ring flex min-h-15 items-center gap-4 rounded-2xl border px-5 py-4 text-left text-sm font-medium transition ${style}`} key={option} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} type="button">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border text-xs">{String.fromCharCode(65 + optionIndex)}</span>
                      {option}
                      {answered && isAnswer && <Check className="ml-auto size-4 text-[var(--success)]" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-6 rounded-2xl bg-[var(--surface-soft)] p-5">
                  <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${correct ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>{correct ? 'Correct' : 'Not quite'}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{question.explanation}</p>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold disabled:opacity-30" disabled={index === 0} onClick={() => setIndex((current) => current - 1)} type="button"><ArrowLeft className="size-4" />Previous</button>
                {finished ? (
                  <button className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--surface)]" onClick={restart} type="button"><RotateCcw className="size-4" />Score {score}/{quiz.questions.length}</button>
                ) : (
                  <button className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-[var(--surface)] disabled:opacity-30" disabled={!answered} onClick={() => setIndex((current) => Math.min(current + 1, quiz.questions.length - 1))} type="button">Next <ArrowRight className="size-4" /></button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close chapter drawer" className="absolute inset-0 bg-black/55" onClick={() => setDrawerOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,320px)] border-r bg-[var(--surface-soft)] shadow-2xl">
            <button className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border bg-[var(--surface)]" onClick={() => setDrawerOpen(false)} type="button"><X className="size-4" /></button>
            <ChapterPanel activeId={chapter.id} chapters={course.chapters} courseId={course.id} />
          </aside>
        </div>
      )}
    </main>
  );
}

function getQuiz(value: unknown): LessonQuiz | null {
  if (!value || typeof value !== 'object' || !('questions' in value)) return null;
  const questions = (value as { questions: unknown }).questions;
  if (!Array.isArray(questions)) return null;
  const parsed = questions.filter((item): item is QuizQuestion => Boolean(item) && typeof item === 'object' && typeof (item as QuizQuestion).question === 'string' && Array.isArray((item as QuizQuestion).options) && typeof (item as QuizQuestion).correct_answer_index === 'number');
  return parsed.length ? { questions: parsed } : null;
}
