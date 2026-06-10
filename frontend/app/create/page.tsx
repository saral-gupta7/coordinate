'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { createCoursePlanAction } from '@/lib/actions/create.action';
import {
  experienceOptions,
  learningModeOptions,
  preferredStyleOptions,
} from '@/lib/constants/create.constants';
import type { CreateCourseInput } from '@/lib/schemas/course.schema';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateCoursePage() {
  const router = useRouter();
  const [weeklyCommitment, setWeeklyCommitment] = useState(3);
  const [selectedLevel, setSelectedLevel] =
    useState<CreateCourseInput['experience_level']>('beginner');

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<CreateCourseInput>({
    defaultValues: {
      experience_level: 'beginner',
      goal: '',
      learning_mode: 'guided path',
      preferred_style: 'step by step',
      topic: '',
      weekly_commitment: 3,
    },
  });

  const onSubmit = async (values: CreateCourseInput) => {
    const actionResult = await createCoursePlanAction({
      ...values,
      weekly_commitment: weeklyCommitment,
    });

    if (!actionResult.ok) {
      setError('root', {
        message: actionResult.error,
      });
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <header className="relative z-10 border-b border-white/10 bg-[#07080a]/86 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            className="group inline-flex items-center gap-2 text-sm font-semibold"
            href="/dashboard"
          >
            <span className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10">
              <Sparkles className="size-4 transition-transform group-hover:scale-110" />
            </span>
            Coordinate
          </Link>

          <Button
            asChild
            className="border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
            size="sm"
            variant="outline"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Dashboard
            </Link>
          </Button>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-2xl items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
        <motion.form
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-4xl border border-white/10 bg-[#0d0e11]/94 p-5 shadow-2xl shadow-black/35 sm:p-6"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          onSubmit={handleSubmit(onSubmit)}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-7 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f9aff]">
                New course
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-normal text-[#f4f1ea] sm:text-4xl">
                Create a course
              </h1>
            </div>
            {/* <div className="hidden h-px w-28 bg-[#7887ff]/40 sm:block" /> */}
          </div>

          <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FieldBlock error={errors.topic?.message} label="Topic">
                <Input
                  className="h-12 rounded-none border-white/12 bg-black/20 px-4 text-base text-[#f4f1ea] transition-all placeholder:text-[#77716a] hover:border-white/20 focus-visible:border-[#7887ff]/70 focus-visible:ring-[#7887ff]/20"
                  placeholder="Spanish for beginners"
                  {...register('topic', {
                    maxLength: { message: 'Topic is too long', value: 120 },
                    minLength: { message: 'Topic is too short', value: 2 },
                    required: 'Topic is required',
                  })}
                />
              </FieldBlock>

              <FieldBlock
                error={errors.learning_mode?.message}
                label="Learning mode"
              >
                <select
                  className="h-12 w-full rounded-none border border-white/12 bg-black/20 px-4 text-base text-[#f4f1ea] outline-none transition-all hover:border-white/20 focus:border-[#7887ff]/70"
                  {...register('learning_mode', {
                    required: 'Learning mode is required',
                  })}
                >
                  {learningModeOptions.map((option) => (
                    <option
                      className="bg-[#101116]"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldBlock>
            </div>

            <FieldBlock error={errors.goal?.message} label="Goal">
              <Textarea
                className="min-h-32 rounded-none border-white/12 bg-black/20 px-4 py-3 text-base leading-7 text-[#f4f1ea] transition-all placeholder:text-[#77716a] hover:border-white/20 focus-visible:border-[#7887ff]/70 focus-visible:ring-[#7887ff]/20"
                placeholder="Hold simple conversations, understand common phrases, and build a daily practice habit."
                {...register('goal', {
                  maxLength: { message: 'Goal is too long', value: 500 },
                  minLength: { message: 'Goal is too short', value: 2 },
                  required: 'Goal is required',
                })}
              />
            </FieldBlock>

            <FieldBlock error={errors.experience_level?.message} label="Level">
              <div className="grid gap-3 sm:grid-cols-3">
                {experienceOptions.map((option) => {
                  const isSelected = selectedLevel === option.value;

                  return (
                    <label
                      className={`group flex cursor-pointer items-center gap-3 border px-4 py-3 transition-all hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-[#7887ff]/55 bg-[#7887ff]/12 text-white shadow-[0_0_24px_rgba(120,135,255,.12)]'
                          : 'border-white/12 bg-black/20 text-[#b8b1a8] hover:border-white/24 hover:bg-white/[0.045]'
                      }`}
                      key={option.value}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        value={option.value}
                        onClick={() => {
                          setSelectedLevel(option.value);
                          setValue('experience_level', option.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        {...register('experience_level', {
                          required: 'Level is required',
                        })}
                      />
                      <span
                        className={`flex size-4 items-center justify-center rounded-full border ${
                          isSelected ? 'border-[#aab2ff]' : 'border-white/30'
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2 rounded-full bg-[#aab2ff]" />
                        )}
                      </span>
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </FieldBlock>

            <div className="grid gap-4 md:grid-cols-2">
              <FieldBlock error={errors.preferred_style?.message} label="Style">
                <select
                  className="h-12 w-full rounded-none border border-white/12 bg-black/20 px-4 text-base text-[#f4f1ea] outline-none transition-all hover:border-white/20 focus:border-[#7887ff]/70"
                  {...register('preferred_style', {
                    required: 'Style is required',
                  })}
                >
                  {preferredStyleOptions.map((option) => (
                    <option
                      className="bg-[#101116]"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </FieldBlock>

              <FieldBlock
                error={errors.weekly_commitment?.message}
                label="Weekly commitment"
              >
                <div className="border border-white/12 bg-black/20 px-4 py-3">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-[#aaa39b]">Hours</span>
                    <span className="font-mono text-lg text-[#f4f1ea]">
                      {weeklyCommitment}
                    </span>
                  </div>
                  <Slider
                    className="[&_[data-slot=slider-range]]:bg-[#7887ff] [&_[data-slot=slider-thumb]]:border-[#aab2ff] [&_[data-slot=slider-thumb]]:bg-[#f4f1ea] [&_[data-slot=slider-track]]:bg-white/12"
                    max={40}
                    min={1}
                    onValueChange={([value]) => {
                      const nextValue = value ?? 1;
                      setWeeklyCommitment(nextValue);
                      setValue('weekly_commitment', nextValue, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    step={1}
                    value={[weeklyCommitment]}
                  />
                </div>
              </FieldBlock>
            </div>
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
            {errors.root?.message && (
              <p className="mb-4 text-center text-sm text-[#d58b6a]">
                {errors.root.message}
              </p>
            )}

            <Button
              className="h-12 w-full rounded-none bg-[#6f7dff] text-white shadow-[0_0_34px_rgba(111,125,255,.24)] transition-all hover:-translate-y-0.5 hover:bg-[#7c8cff] disabled:hover:translate-y-0"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating
                </>
              ) : (
                <>
                  Create course
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </section>
    </main>
  );
}

function FieldBlock({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="group grid gap-2">
      <span className="text-base font-medium text-[#f4f1ea] transition-colors group-focus-within:text-white">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-[#d58b6a]">{error}</span>}
    </label>
  );
}
