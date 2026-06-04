"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileText,
  LockKeyhole,
  MessageSquareText,
  PanelLeft,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  agentSteps,
  buildFlow,
  courses,
  documentRows,
  fadeUp,
  lessonPipeline,
  sidebarItems,
  stagger,
  transition,
} from "@/lib/constants/dashboard.constants";
import SignOut from "@/components/sign-out";
import { getSession } from "@/lib/session";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const reduceMotion = useReducedMotion();

  const { data: session, isPending } = authClient.useSession();
  // const session = await getSession();

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
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { x: ["-58%", "-42%", "-58%"], opacity: [0.25, 0.85, 0.25] }
        }
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-24 h-px w-[72rem] bg-gradient-to-r from-transparent via-[#7887ff]/45 to-transparent"
        transition={
          reduceMotion
            ? undefined
            : { duration: 12, ease: "easeInOut", repeat: Infinity }
        }
      />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#07080a]/88 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link
              className="group flex items-center gap-2 text-sm font-semibold"
              href="/"
            >
              <span className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10">
                <Sparkles className="size-4 transition-transform group-hover:scale-110" />
              </span>
              Coordinate
            </Link>
            <PanelLeft className="size-4 text-[#77716a]" />
          </div>

          <nav aria-label="Dashboard" className="flex-1 px-3 py-5">
            <p className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
              Workspace
            </p>
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <Link
                  className={`group flex h-11 items-center gap-3 border px-3 text-sm transition-all hover:translate-x-1 ${
                    index === 0
                      ? "border-[#7887ff]/35 bg-[#7887ff]/12 text-white"
                      : "border-transparent text-[#9d968e] hover:border-white/10 hover:bg-white/[0.045] hover:text-[#f4f1ea]"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  <item.icon className="size-4 text-[#8f9aff]" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-4 border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  className="size-10 border border-[#7887ff]/35"
                  size="lg"
                >
                  <AvatarImage
                    alt="Signed-in user profile image"
                    src={session?.user.image}
                  />
                  <AvatarFallback className="bg-[#14161d] text-[#d8d2ca]">
                    AF
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#f4f1ea]">
                    {session?.user.name}
                  </p>
                  <p className="truncate text-xs text-[#77716a]">
                    {session?.user.email}
                  </p>
                </div>
              </div>
            </div>
            <Button className="h-10 w-full bg-[#6f7dff] text-white hover:bg-[#7c8cff]">
              <Plus className="size-4" />
              New course
            </Button>
          </div>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080a]/82 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                className="flex size-8 items-center justify-center border border-white/14 bg-white/[0.04]"
                href="/"
              >
                <Sparkles className="size-4" />
              </Link>
              <span className="text-sm font-semibold">Coordinate</span>
            </div>

            <div className="hidden items-center gap-2 rounded-sm border border-[#6f7dff]/25 bg-[#6f7dff]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aab2ff] sm:flex">
              <LockKeyhole className="size-3.5" />
              Protected dashboard shell
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Button
                className="hidden border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white sm:inline-flex"
                variant="outline"
              >
                <Search className="size-4" />
                Search
              </Button>
              <Avatar className="size-9 border border-[#7887ff]/35">
                <AvatarImage
                  alt="Signed-in user profile image"
                  src={session?.user.image}
                />
                <AvatarFallback className="bg-[#14161d] text-[#d8d2ca]">
                  AF
                </AvatarFallback>
              </Avatar>
              <SignOut />
            </div>
          </div>

          <nav
            aria-label="Mobile dashboard"
            className="flex gap-2 overflow-x-auto border-t border-white/10 px-5 py-3 lg:hidden"
          >
            {sidebarItems.map((item) => (
              <Link
                className="flex shrink-0 items-center gap-2 border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#c7c1b9]"
                href={item.href}
                key={item.label}
              >
                <item.icon className="size-3.5 text-[#8f9aff]" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <motion.div
          animate="visible"
          className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
          initial="hidden"
          variants={stagger}
        >
          <motion.section
            className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"
            id="overview"
            variants={fadeUp}
          >
            <div className="relative overflow-hidden border border-white/10 bg-[#0d0e11]/92 p-6 shadow-2xl shadow-black/35 sm:p-8">
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { opacity: [0, 1, 0], y: ["-35%", "240%"] }
                }
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-[#7887ff]/14 to-transparent"
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 5.8, ease: "easeInOut", repeat: Infinity }
                }
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">
                  Authenticated course workspace
                </p>
                <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-[#f4f1ea] sm:text-5xl">
                  Your adaptive learning control room.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a7a199]">
                  Course lists, planner runs, generated lessons, tutor context,
                  and private documents live in one protected workspace.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button className="h-11 bg-[#6f7dff] text-white shadow-[0_0_38px_rgba(111,125,255,.3)] hover:bg-[#7c8cff]">
                    <Plus className="size-4" />
                    Create course
                  </Button>
                  <Button
                    className="h-11 border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
                    variant="outline"
                  >
                    <Activity className="size-4" />
                    View agent trace
                  </Button>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                    Today
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Study pulse
                  </h2>
                </div>
                <Radio className="size-5 text-[#8f9aff]" />
              </div>
              <div className="grid grid-cols-3 border border-white/10 bg-black/20">
                {[
                  ["3", "courses"],
                  ["12", "chapters"],
                  ["4", "docs"],
                ].map(([value, label]) => (
                  <div
                    className="border-r border-white/10 p-4 last:border-r-0"
                    key={label}
                  >
                    <p className="font-mono text-2xl">{value}</p>
                    <p className="mt-1 text-xs text-[#827c74]">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border border-white/10 bg-black/20 p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-[#c7c1b9]">MVP readiness</span>
                  <span className="font-mono text-xs text-[#8f9aff]">42%</span>
                </div>
                <Progress
                  className="bg-white/10 [&_[data-slot=progress-indicator]]:bg-[#7887ff]"
                  value={42}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]"
            id="courses"
            variants={fadeUp}
          >
            <div className="border border-white/10 bg-white/[0.025] p-5 sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                    User-owned courses
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Course list
                  </h2>
                </div>
                <Button className="h-10 bg-[#f4f1ea] text-black hover:bg-white">
                  <Plus className="size-4" />
                  Basic course
                </Button>
              </div>

              <div className="grid gap-3">
                {courses.map((course) => (
                  <motion.article
                    className="group border border-white/10 bg-black/20 p-4 transition-all hover:-translate-y-1 hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]"
                    key={course.title}
                    transition={transition}
                    variants={fadeUp}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-medium text-[#f4f1ea]">
                            {course.title}
                          </h3>
                          <span className="border border-[#7887ff]/30 bg-[#7887ff]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#aab2ff]">
                            {course.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#8f8981]">
                          {course.chapters} / next: {course.next}
                        </p>
                      </div>
                      <div className="w-full md:w-48">
                        <div className="mb-2 flex justify-between font-mono text-xs text-[#77716a]">
                          <span>progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress
                          className="bg-white/10 [&_[data-slot=progress-indicator]]:bg-[#7887ff]"
                          value={course.progress}
                        />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="border border-dashed border-white/14 bg-white/[0.018] p-6">
              <CircleDot className="size-5 text-[#8f9aff]" />
              <h2 className="mt-16 text-3xl font-semibold leading-tight tracking-normal">
                Empty state ready.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#918a82]">
                When the course API returns no records, this space can become
                the first-course prompt without changing the layout.
              </p>
              <Button
                className="mt-7 h-10 border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
                variant="outline"
              >
                Create from topic
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.section>

          <motion.section
            className="mt-5 grid gap-5 xl:grid-cols-5"
            variants={stagger}
          >
            <motion.div
              className="border border-white/10 bg-white/[0.025] p-5 sm:p-6 xl:col-span-2"
              id="planner"
              variants={fadeUp}
            >
              <div className="mb-6 flex items-center gap-2 text-sm text-[#c7c1b9]">
                <Bot className="size-4 text-[#8f9aff]" />
                Agentic course planner
              </div>
              <div className="space-y-3">
                {agentSteps.map((step, index) => (
                  <div
                    className="grid grid-cols-[32px_1fr_auto] items-center gap-3"
                    key={step}
                  >
                    <span className="flex size-8 items-center justify-center border border-white/10 font-mono text-xs text-[#77716a]">
                      {index + 1}
                    </span>
                    <span className="border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#c7c1b9]">
                      {step}
                    </span>
                    <CheckCircle2 className="size-4 text-[#8f9aff]" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="border border-white/10 bg-white/[0.025] p-5 sm:p-6 xl:col-span-3"
              id="lessons"
              variants={fadeUp}
            >
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                    Lesson builder
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Current chapter artifacts
                  </h2>
                </div>
                <Button className="h-10 bg-[#6f7dff] text-white hover:bg-[#7c8cff]">
                  Generate lesson
                  <Sparkles className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {lessonPipeline.map((item) => (
                  <div
                    className="group border border-white/10 bg-black/20 p-4 transition-colors hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]"
                    key={item.label}
                  >
                    <item.icon className="size-4 text-[#8f9aff] transition-transform group-hover:-translate-y-1" />
                    <p className="mt-12 text-sm text-[#918a82]">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border border-white/10 bg-black/20 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                  Quiz preview
                </p>
                <p className="mt-3 text-sm leading-6 text-[#c7c1b9]">
                  Which design choice keeps lesson generation inspectable
                  instead of hiding everything behind one prompt?
                </p>
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]"
            variants={stagger}
          >
            <motion.div
              className="border border-white/10 bg-white/[0.025] p-5 sm:p-6"
              id="tutor"
              variants={fadeUp}
            >
              <div className="mb-6 flex items-center gap-2 text-sm text-[#c7c1b9]">
                <MessageSquareText className="size-4 text-[#8f9aff]" />
                Course-aware tutor
              </div>
              <div className="space-y-3">
                <div className="max-w-[82%] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#c7c1b9]">
                  Explain this chapter more simply and give me an example.
                </div>
                <div className="ml-auto max-w-[88%] border border-[#7887ff]/30 bg-[#7887ff]/10 p-4 text-sm leading-6 text-[#d8d2ca]">
                  I can use your chapter outline, latest quiz result, and
                  attached notes to answer inside this course.
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {[
                  "Explain simply",
                  "Give example",
                  "Quiz me",
                  "Connect to project",
                ].map((action) => (
                  <Button
                    className="justify-between border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
                    key={action}
                    variant="outline"
                  >
                    {action}
                    <ChevronRight className="size-4" />
                  </Button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="border border-white/10 bg-white/[0.025] p-5 sm:p-6"
              id="documents"
              variants={fadeUp}
            >
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
                    Document RAG
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Private learning sources
                  </h2>
                </div>
                <Button
                  className="h-10 border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
                  variant="outline"
                >
                  Upload
                  <FileText className="size-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {documentRows.map((doc) => (
                  <div
                    className="flex flex-col gap-3 border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                    key={doc.name}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-[#8f9aff]" />
                      <div>
                        <p className="text-sm font-medium text-[#f4f1ea]">
                          {doc.name}
                        </p>
                        <p className="mt-1 text-xs text-[#77716a]">
                          {doc.chunks}
                        </p>
                      </div>
                    </div>
                    <span className="w-fit border border-white/10 bg-white/[0.035] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#aab2ff]">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            className="mt-5 border border-white/10 bg-[#0d0e11]/92 p-5 sm:p-6"
            variants={fadeUp}
          >
            <div className="mb-6 flex items-center gap-2 text-sm text-[#c7c1b9]">
              <ShieldCheck className="size-4 text-[#8f9aff]" />
              Build order from flow.md
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {buildFlow.map((feature, index) => (
                <div
                  className="border border-white/10 bg-black/20 p-4"
                  key={feature}
                >
                  <p className="font-mono text-xs text-[#8f9aff]">
                    0{index + 1}
                  </p>
                  <p className="mt-8 text-sm leading-6 text-[#d8d2ca]">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
