"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  GraduationCap,
  Layers3,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  agentTrace,
  documentSources,
  fadeIn,
  fadeUp,
  featureCards,
  metrics,
  plannerSteps,
  revealTransition,
  stagger,
  viewport,
} from "@/lib/constants/home.constants";

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.main
      animate="visible"
      className="min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white"
      initial="hidden"
      transition={{ duration: 0.35 }}
      variants={fadeIn}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.026)_0,rgba(255,255,255,.026)_1px,transparent_1px,transparent_8px)]"
      />

      <motion.header className="relative z-10 border-b border-white/10 bg-[#07080a]/85 backdrop-blur" transition={revealTransition} variants={fadeUp}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2 text-sm font-semibold" href="/">
            <span className="flex size-7 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10">
              <Sparkles className="size-4 transition-transform group-hover:scale-110" />
            </span>
            Coordinate
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild className="text-[#b8b4ad] hover:bg-white/[0.06] hover:text-white" size="sm" variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-[#f4f1ea] text-black hover:bg-white" size="sm">
              <Link href="/login">Start</Link>
            </Button>
          </div>
        </nav>
      </motion.header>

      <section className="relative z-10 border-b border-white/10">
        <motion.div
          animate={reduceMotion ? undefined : { x: ["-54%", "-46%", "-54%"], opacity: [0.35, 1, 0.35] }}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-8 h-px w-[72rem] bg-gradient-to-r from-transparent via-[#7887ff]/45 to-transparent"
          transition={reduceMotion ? undefined : { duration: 12, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.div
          animate="visible"
          className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20"
          initial="hidden"
          variants={stagger}
        >
          <motion.div className="flex flex-col justify-center" variants={stagger}>
            <motion.p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]" transition={revealTransition} variants={fadeUp}>
              Adaptive learning, mapped
            </motion.p>
            <motion.h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#f4f1ea] sm:text-6xl lg:text-7xl" transition={revealTransition} variants={fadeUp}>
              A course that knows where you are going.
            </motion.h1>
            <motion.p className="mt-6 max-w-xl text-base leading-8 text-[#a7a199] sm:text-lg" transition={revealTransition} variants={fadeUp}>
              Coordinate turns a topic into a guided learning workspace with planned chapters, generated lessons,
              quizzes, a course-aware tutor, and private document context.
            </motion.p>

            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" transition={revealTransition} variants={fadeUp}>
              <Button asChild className="h-11 bg-[#6f7dff] px-5 text-white shadow-[0_0_38px_rgba(111,125,255,.38)] transition-transform hover:-translate-y-0.5 hover:bg-[#7c8cff]">
                <Link href="/login">
                  Create a course
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 border-white/14 bg-white/[0.035] px-5 text-[#d8d4ce] transition-transform hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                variant="outline"
              >
                <Link href="#system">Explore system</Link>
              </Button>
            </motion.div>

            <motion.div className="mt-10 grid max-w-xl grid-cols-3 border border-white/10 bg-white/[0.025]" transition={revealTransition} variants={fadeUp}>
              {metrics.map((metric) => (
                <div className="border-r border-white/10 p-4 last:border-r-0" key={metric.label}>
                  <p className="font-mono text-2xl text-[#f4f1ea]">{metric.value}</p>
                  <p className="mt-1 text-xs leading-5 text-[#827c74]">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex items-center lg:justify-end">
            <motion.div
              animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -10, 0] }}
              className="w-full max-w-2xl border border-white/12 bg-[#0d0e11]/95 shadow-2xl shadow-black/60"
              initial={{ opacity: 0, y: 28 }}
              transition={
                reduceMotion
                  ? revealTransition
                  : {
                      opacity: { duration: 0.6, ease: "easeOut" },
                      y: { duration: 5.2, ease: "easeInOut", repeat: Infinity },
                    }
              }
              whileHover={reduceMotion ? undefined : { y: -14 }}
            >
              <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#77716a]">Coordinate / AI Systems</div>
                <div className="rounded-sm border border-[#6f7dff]/30 bg-[#6f7dff]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aab2ff]">
                  Live map
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[190px_1fr]">
                <aside className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
                  <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">Course rail</p>
                  <div className="space-y-2">
                    {["Foundations", "Core models", "Practice lab", "Capstone"].map((item, index) => (
                      <div
                        className={`group border px-3 py-2 text-sm transition-all hover:translate-x-1 ${
                          index === 1
                            ? "border-[#6f7dff]/40 bg-[#6f7dff]/12 text-[#f4f1ea]"
                            : "border-white/10 bg-white/[0.025] text-[#8b857d] hover:border-white/20 hover:text-[#c7c1b9]"
                        }`}
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="relative overflow-hidden p-5 sm:p-6">
                  <motion.div
                    animate={reduceMotion ? undefined : { opacity: [0, 1, 1, 0], y: ["-45%", "285%"] }}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-[#7887ff]/20 to-transparent"
                    transition={reduceMotion ? undefined : { duration: 5.8, ease: "easeInOut", repeat: Infinity }}
                  />
                  <div className="relative">
                    <div className="mb-7 flex items-center gap-2 text-sm text-[#b8b2aa]">
                      <GraduationCap className="size-4 text-[#8f9aff]" />
                      Lesson builder
                    </div>
                    <h2 className="text-2xl font-semibold leading-8 text-[#f4f1ea]">
                      Explain transformers with a project, checkpoint quiz, and document citations.
                    </h2>

                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      {["Draft lesson", "Quiz", "Next step"].map((item, index) => (
                        <div
                          className="group border border-white/10 bg-white/[0.025] p-4 transition-all hover:-translate-y-1 hover:border-[#7887ff]/35 hover:bg-[#7887ff]/10"
                          key={item}
                        >
                          <div className="mb-8 flex items-center justify-between">
                            <span className="font-mono text-xs text-[#77716a]">0{index + 1}</span>
                            <span className="size-2 border border-[#7887ff]/50 bg-[#7887ff]/40 transition-transform group-hover:rotate-45" />
                          </div>
                          <p className="text-sm font-medium text-[#d8d2ca]">{item}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border border-white/10 bg-black/25 p-4 transition-colors hover:border-white/20">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">Tutor prompt</p>
                      <p className="mt-3 text-sm leading-6 text-[#b8b2aa]">
                        &quot;Show me why attention matters, then quiz me with one practical example.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <motion.section
        className="relative z-10 border-b border-white/10 px-5 py-24 sm:px-8 lg:px-10"
        id="system"
        initial="hidden"
        transition={revealTransition}
        variants={fadeUp}
        viewport={viewport}
        whileInView="visible"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">The method</p>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                A learning loop with fewer loose ends.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#918a82]">
                The page stays simple because the product does the organization underneath.
              </p>
            </div>

            <motion.div className="grid gap-4 md:grid-cols-3" variants={stagger}>
              {plannerSteps.map((step) => (
                <motion.article
                  className="group min-h-72 border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]"
                  key={step.title}
                  transition={revealTransition}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { y: -6 }}
                >
                  <p className="font-mono text-xs text-[#8f9aff]">{step.label}</p>
                  <h3 className="mt-12 text-2xl font-medium leading-8 text-[#f4f1ea]">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#8f8981]">{step.body}</p>
                  <div className="mt-8 h-px w-16 bg-[#7887ff]/40 transition-all group-hover:w-28" />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 border-b border-white/10 px-5 py-24 sm:px-8 lg:px-10"
        initial="hidden"
        transition={revealTransition}
        variants={fadeUp}
        viewport={viewport}
        whileInView="visible"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">Agent trace</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              See how the course was planned.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#918a82]">
              Coordinate is designed around visible AI workflows: each planning step can become something you inspect,
              not a hidden prompt behind a spinner.
            </p>
          </div>

          <motion.div className="border border-white/10 bg-white/[0.025] p-5" variants={stagger}>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#c7c1b9]">
                <motion.span
                  animate={reduceMotion ? undefined : { boxShadow: ["0 0 0 0 rgba(120,135,255,.24)", "0 0 0 8px rgba(120,135,255,0)", "0 0 0 0 rgba(120,135,255,0)"] }}
                  className="flex size-5 items-center justify-center"
                  transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Radio className="size-4 text-[#8f9aff]" />
                </motion.span>
                Run timeline
              </div>
              <span className="font-mono text-xs text-[#77716a]">RUN-042</span>
            </div>
            <div className="space-y-3">
              {agentTrace.map((item, index) => (
                <motion.div className="grid grid-cols-[34px_1fr_auto] items-center gap-3" key={item} transition={revealTransition} variants={fadeUp}>
                  <div className="flex size-8 items-center justify-center border border-white/10 font-mono text-xs text-[#77716a]">
                    {index + 1}
                  </div>
                  <div className="relative overflow-hidden border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#c7c1b9] transition-colors hover:border-[#7887ff]/35">
                    {item}
                  </div>
                  <CheckCircle2 className="size-4 text-[#8f9aff]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 border-b border-white/10 px-5 py-24 sm:px-8 lg:px-10"
        initial="hidden"
        variants={stagger}
        viewport={viewport}
        whileInView="visible"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-4">
          {featureCards.map((feature) => (
            <motion.article
              className="group min-h-80 border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-[#7887ff]/35 hover:bg-white/[0.045]"
              key={feature.title}
              transition={revealTransition}
              variants={fadeUp}
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <feature.icon className="size-5 text-[#8f9aff] transition-transform group-hover:-translate-y-1" />
              <h3 className="mt-20 text-2xl font-medium leading-8 text-[#f4f1ea]">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#918a82]">{feature.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 border-b border-white/10 px-5 py-24 sm:px-8 lg:px-10"
        initial="hidden"
        transition={revealTransition}
        variants={fadeUp}
        viewport={viewport}
        whileInView="visible"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div className="border border-white/10 bg-white/[0.025] p-6" variants={stagger}>
            <div className="mb-6 flex items-center gap-2 text-sm text-[#c7c1b9]">
              <Search className="size-4 text-[#8f9aff]" />
              Private retrieval
            </div>
            <div className="space-y-3">
              {documentSources.map((source, index) => (
                <motion.div
                  className="group flex items-center justify-between border border-white/10 bg-black/20 px-4 py-3 transition-colors hover:border-[#7887ff]/35"
                  key={source}
                  transition={revealTransition}
                  variants={fadeUp}
                  whileHover={reduceMotion ? undefined : { x: 6 }}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-[#8f9aff]" />
                    <span className="text-sm text-[#c7c1b9]">{source}</span>
                  </div>
                  <span className="font-mono text-xs text-[#77716a]">{index + 2} chunks</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">Document context</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              Your notes become part of the lesson.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#918a82]">
              Upload documents once, then let lessons and tutor responses retrieve the relevant pieces when they matter.
              It keeps the workspace personal without adding clutter.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative z-10 px-5 py-24 sm:px-8 lg:px-10"
        initial="hidden"
        variants={stagger}
        viewport={viewport}
        whileInView="visible"
      >
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          <motion.article className="border border-white/10 bg-white/[0.025] p-7 sm:p-10 lg:col-span-2" transition={revealTransition} variants={fadeUp}>
            <Layers3 className="size-5 text-[#8f9aff]" />
            <h2 className="mt-24 max-w-2xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              One surface for planning, studying, asking, and proving.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#918a82]">
              Coordinate is not another folder of AI outputs. It is a structured learning workspace where each answer
              knows the course, each lesson has a place, and each document can be traced back.
            </p>
          </motion.article>

          <motion.article className="border border-white/10 bg-[#6f7dff] p-7 text-white sm:p-10" transition={revealTransition} variants={fadeUp} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <Zap className="size-5" />
            <h2 className="mt-24 text-4xl font-semibold leading-tight tracking-normal">Build the course you wish existed.</h2>
            <Button asChild className="mt-8 bg-white text-black hover:bg-[#f4f1ea]">
              <Link href="/login">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </motion.article>
        </div>
      </motion.section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Coordinate</p>
            <p className="mt-2 text-sm text-[#77716a]">Adaptive learning, mapped.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-[#77716a]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Private by design
            </span>
            <span className="flex items-center gap-2">
              <Brain className="size-4" />
              Built for focused study
            </span>
          </div>
        </div>
      </footer>
    </motion.main>
  );
}
