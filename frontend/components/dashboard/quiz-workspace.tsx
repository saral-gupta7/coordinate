'use client';

import { Badge } from '@/components/ui/badge';
import type { LessonQuiz, QuizQuestion } from '@/lib/schemas/lesson.schema';
import { CheckCircle2, ChevronLeft, Circle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type QuizWorkspaceProps = {
  course: {
    id: string;
    title: string;
  };
  chapter: {
    id: string;
    title: string;
    order: number;
    quizJson: unknown;
  };
};

export function QuizWorkspace({ chapter, course }: QuizWorkspaceProps) {
  const quiz = useMemo(() => getQuiz(chapter.quizJson), [chapter.quizJson]);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!quiz) {
    return (
      <main className="min-h-screen bg-[#090a0d] p-[clamp(1rem,2.4vw,2.5rem)] text-[#f4f1ea]">
        <BackLink courseId={course.id} />
        <div className="mt-6 border border-white/10 bg-white/[0.025] p-5">
          <h1 className="text-2xl font-semibold">Quiz unavailable</h1>
        </div>
      </main>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const correctCount = quiz.questions.reduce((total, question, index) => {
    return answers[index] === question.correct_answer_index ? total + 1 : total;
  }, 0);

  return (
    <main className="min-h-screen bg-[#090a0d] text-[#f4f1ea]">
      <div className="mx-auto w-full max-w-[1180px] px-[clamp(1rem,2.4vw,2.5rem)] py-5">
        <BackLink courseId={course.id} />

        <header className="mt-5 grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-[#7887ff]/30 bg-[#7887ff]/10 text-[#aab2ff]">
                Chapter {chapter.order}
              </Badge>
              <Badge
                className="border-white/10 bg-white/[0.035] text-[#9d968e]"
                variant="outline"
              >
                {quiz.questions.length} questions
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
              {chapter.title}
            </h1>
            <p className="mt-3 text-sm text-[#9d968e]">{course.title}</p>
          </div>

          <div className="grid grid-cols-2 border border-white/10 bg-white/[0.025]">
            <ScoreMetric label="answered" value={`${answeredCount}/${quiz.questions.length}`} />
            <ScoreMetric label="correct" value={correctCount} />
          </div>
        </header>

        <section className="grid gap-4 py-5">
          {quiz.questions.map((question, questionIndex) => {
            const selectedAnswer = answers[questionIndex];
            const hasAnswered = selectedAnswer !== undefined;
            const isCorrect = selectedAnswer === question.correct_answer_index;

            return (
              <article
                className="border border-white/10 bg-white/[0.025] p-5"
                key={question.question}
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-white/10 bg-black/20 font-mono text-xs text-[#8f9aff]">
                    {questionIndex + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="max-w-3xl text-base font-semibold leading-7 text-[#f4f1ea]">
                        {question.question}
                      </h2>
                      {hasAnswered && (
                        <Badge
                          className={
                            isCorrect
                              ? 'border-[#7ed7a5]/35 bg-[#7ed7a5]/10 text-[#d8f8e3]'
                              : 'border-[#d58b6a]/35 bg-[#d58b6a]/10 text-[#f0b89f]'
                          }
                          variant="outline"
                        >
                          {isCorrect ? 'correct' : 'incorrect'}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isAnswer = optionIndex === question.correct_answer_index;

                        return (
                          <button
                            className={getOptionClass({
                              hasAnswered,
                              isAnswer,
                              isSelected,
                            })}
                            key={option}
                            onClick={() =>
                              setAnswers((current) => ({
                                ...current,
                                [questionIndex]: optionIndex,
                              }))
                            }
                            type="button"
                          >
                            {getOptionIcon({
                              hasAnswered,
                              isAnswer,
                              isSelected,
                            })}
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div className="mt-4 border border-white/10 bg-black/20 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f9aff]">
                          {question.concept}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#b8b1a8]">
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}

function BackLink({ courseId }: { courseId: string }) {
  return (
    <Link
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8b857e] transition-colors hover:text-[#f4f1ea]"
      href={`/dashboard/courses/${courseId}`}
    >
      <ChevronLeft className="size-4" />
      Course
    </Link>
  );
}

function ScoreMetric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border-r border-white/10 p-4 last:border-r-0">
      <p className="font-mono text-2xl text-[#f4f1ea]">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f9aff]">
        {label}
      </p>
    </div>
  );
}

function getOptionClass({
  hasAnswered,
  isAnswer,
  isSelected,
}: {
  hasAnswered: boolean;
  isAnswer: boolean;
  isSelected: boolean;
}) {
  const base =
    'flex items-start gap-3 border p-3 text-left text-sm leading-6 transition-colors';

  if (!hasAnswered) {
    return `${base} border-white/10 bg-black/20 text-[#d8d2ca] hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]`;
  }

  if (isAnswer) {
    return `${base} border-[#7ed7a5]/35 bg-[#7ed7a5]/10 text-[#d8f8e3]`;
  }

  if (isSelected) {
    return `${base} border-[#d58b6a]/35 bg-[#d58b6a]/10 text-[#f0b89f]`;
  }

  return `${base} border-white/10 bg-white/[0.025] text-[#77716a]`;
}

function getOptionIcon({
  hasAnswered,
  isAnswer,
  isSelected,
}: {
  hasAnswered: boolean;
  isAnswer: boolean;
  isSelected: boolean;
}) {
  if (!hasAnswered) {
    return <Circle className="mt-1 size-4 shrink-0 text-[#77716a]" />;
  }

  if (isAnswer) {
    return <CheckCircle2 className="mt-1 size-4 shrink-0 text-[#7ed7a5]" />;
  }

  if (isSelected) {
    return <XCircle className="mt-1 size-4 shrink-0 text-[#d58b6a]" />;
  }

  return <Circle className="mt-1 size-4 shrink-0 text-[#55504a]" />;
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
