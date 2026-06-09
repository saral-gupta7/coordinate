"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  experienceOptions,
  agentPreview,
  learningModeOptions,
  preferredStyleOptions,
} from "@/lib/constants/create.constants";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Radio,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateCourseInput } from "@/lib/schemas/course.schema";
import { createCoursePlanAction } from "@/lib/actions/create.action";

export default function CreateCoursePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    defaultValues: {
      topic: "",
      goal: "",
      experience_level: "beginner",
      preferred_style: "project-based",
      weekly_commitment: 3,
      learning_mode: "skill-building",
    },
  });

  const onSubmit = async (values: CreateCourseInput) => {
    const actionResult = await createCoursePlanAction({
      ...values,
      weekly_commitment: Number(values.weekly_commitment),
    });

    if (!actionResult.ok) {
      setError("root", {
        message: actionResult.error,
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.023)_0,rgba(255,255,255,.023)_1px,transparent_1px,transparent_8px)]"
      />

      <header className="relative z-10 border-b border-white/10 bg-[#07080a]/85 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link
            className="group flex items-center gap-2 text-sm font-semibold"
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

      <section className="relative z-10 mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-10">
        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24 lg:h-fit"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">
            Agentic course planner
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Shape a course the agent can actually reason about.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#a7a199]">
            Define the learner, goal, time budget, and study mode. Coordinate
            will run the planner graph and return a course blueprint with a
            visible trace.
          </p>

          <div className="mt-8 border border-white/10 bg-white/[0.025] p-5">
            <div className="mb-5 flex items-center gap-2 text-sm text-[#c7c1b9]">
              <Radio className="size-4 text-[#8f9aff]" />
              Planner timeline
            </div>
            <div className="space-y-3">
              {agentPreview.map((item, index) => (
                <div
                  className="grid grid-cols-[32px_1fr] items-center gap-3"
                  key={item}
                >
                  <span className="flex size-8 items-center justify-center border border-white/10 font-mono text-xs text-[#77716a]">
                    {index + 1}
                  </span>
                  <span className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#c7c1b9]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        <motion.div
          animate="visible"
          className="grid gap-5"
          initial="hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          <motion.form
            className="border border-white/10 bg-[#0d0e11]/92 p-5 shadow-2xl shadow-black/35 sm:p-6"
            onSubmit={handleSubmit(onSubmit)}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                  Course request
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Planner input
                </h2>
              </div>
              <WandSparkles className="size-5 text-[#8f9aff]" />
            </div>

            <div className="grid gap-5">
              <FieldBlock error={errors.topic?.message} label="Topic">
                <Input
                  className="h-11 border-white/12 bg-black/20 text-[#f4f1ea] placeholder:text-[#77716a]"
                  placeholder="LangChain and LangGraph agents"
                  {...register("topic", {
                    required: "Topic is required",
                    minLength: { value: 2, message: "Topic is too short" },
                    maxLength: { value: 120, message: "Topic is too long" },
                  })}
                />
              </FieldBlock>

              <FieldBlock error={errors.goal?.message} label="Goal">
                <Textarea
                  className="min-h-28 border-white/12 bg-black/20 text-[#f4f1ea] placeholder:text-[#77716a]"
                  placeholder="Build production-ready AI agents inside a FastAPI backend."
                  {...register("goal", {
                    required: "Goal is required",
                    minLength: { value: 2, message: "Goal is too short" },
                    maxLength: { value: 500, message: "Goal is too long" },
                  })}
                />
              </FieldBlock>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldBlock
                  error={errors.experience_level?.message}
                  label="Experience level"
                >
                  <select
                    className="h-11 w-full border border-white/12 bg-black/20 px-3 text-sm text-[#f4f1ea] outline-none transition-colors focus:border-[#7887ff]/60"
                    {...register("experience_level", {
                      required: "Experience level is required",
                    })}
                  >
                    {experienceOptions.map((option) => (
                      <option
                        className="bg-[#0d0e11]"
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
                  <Input
                    className="h-11 border-white/12 bg-black/20 text-[#f4f1ea]"
                    max={40}
                    min={1}
                    type="number"
                    {...register("weekly_commitment", {
                      required: "Weekly commitment is required",
                      valueAsNumber: true,
                      min: { value: 1, message: "Use at least 1 hour" },
                      max: { value: 40, message: "Use 40 hours or less" },
                    })}
                  />
                </FieldBlock>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FieldBlock
                  error={errors.preferred_style?.message}
                  label="Preferred style"
                >
                  <select
                    className="h-11 w-full border border-white/12 bg-black/20 px-3 text-sm text-[#f4f1ea] outline-none transition-colors focus:border-[#7887ff]/60"
                    {...register("preferred_style", {
                      required: "Preferred style is required",
                    })}
                  >
                    {preferredStyleOptions.map((option) => (
                      <option
                        className="bg-[#0d0e11]"
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldBlock>

                <FieldBlock
                  error={errors.learning_mode?.message}
                  label="Learning mode"
                >
                  <select
                    className="h-11 w-full border border-white/12 bg-black/20 px-3 text-sm text-[#f4f1ea] outline-none transition-colors focus:border-[#7887ff]/60"
                    {...register("learning_mode", {
                      required: "Learning mode is required",
                    })}
                  >
                    {learningModeOptions.map((option) => (
                      <option
                        className="bg-[#0d0e11]"
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </FieldBlock>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs leading-5 text-[#77716a]">
                  This calls your FastAPI Course Planner through the Next.js API
                  gateway.
                </p>
                {errors.root?.message && (
                  <p className="mt-2 text-xs text-[#d58b6a]">
                    {errors.root.message}
                  </p>
                )}
              </div>
              <Button
                className="h-11 bg-[#6f7dff] text-white shadow-[0_0_34px_rgba(111,125,255,.28)] hover:bg-[#7c8cff]"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Planning
                  </>
                ) : (
                  <>
                    Generate plan
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>

        </motion.div>
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
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#d8d2ca]">{label}</span>
      {children}
      {error && <span className="text-xs text-[#d58b6a]">{error}</span>}
    </label>
  );
}
