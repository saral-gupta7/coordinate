'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { fadeUp, stagger, transition } from '@/lib/constants/dashboard.constants';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpenText, Clock3, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  updatedAt: string;
  _count: {
    chapters: number;
  };
};

type CoursesResponse = {
  courses: DashboardCourse[];
};

function useCourses() {
  return useQuery<CoursesResponse>({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      return response.json();
    },
    retry: 1,
  });
}

export function CourseStatsOverview() {
  const { data, isPending } = useCourses();
  const courses = data?.courses ?? [];
  const totalChapters = courses.reduce(
    (total, course) => total + course._count.chapters,
    0,
  );

  return (
    <motion.div
      animate="visible"
      className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
      initial="hidden"
      variants={stagger}
    >
      <motion.section
        className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"
        variants={fadeUp}
      >
        <div className="relative overflow-hidden border border-white/10 bg-[#0d0e11]/92 p-6 shadow-2xl shadow-black/35 sm:p-8">
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">
              Authenticated course workspace
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-[#f4f1ea] sm:text-5xl">
              Your courses, ready to continue.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#a7a199]">
              Review your saved course plans, track completion progress, and
              jump back into the next chapter when you are ready.
            </p>
            <Button asChild className="mt-7 h-10 bg-[#6f7dff] text-white hover:bg-[#7c8cff]">
              <Link href="/dashboard/courses">
                View courses
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 border border-white/10 bg-white/[0.025]">
          <StatBlock label="courses" loading={isPending} value={courses.length} />
          <StatBlock label="chapters" loading={isPending} value={totalChapters} />
        </div>
      </motion.section>
    </motion.div>
  );
}

export function CourseListPageContent() {
  const { data, isPending, isError, error } = useCourses();
  const courses = data?.courses ?? [];

  return (
    <motion.div
      animate="visible"
      className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
      initial="hidden"
      variants={stagger}
    >
      <motion.section
        className="border border-white/10 bg-white/[0.025] p-5 sm:p-6"
        variants={fadeUp}
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77716a]">
              User-owned courses
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              Course list
            </h1>
          </div>
          <Button asChild className="h-10 bg-[#f4f1ea] text-black hover:bg-white">
            <Link href="/create">
              <Plus className="size-4" />
              New course
            </Link>
          </Button>
        </div>

        {isPending && (
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <div
                className="h-36 animate-pulse border border-white/10 bg-black/20"
                key={item}
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="border border-[#d58b6a]/30 bg-[#d58b6a]/10 p-4 text-sm text-[#f0b89f]">
            {error instanceof Error ? error.message : 'Failed to fetch courses.'}
          </div>
        )}

        {!isPending && !isError && courses.length === 0 && (
          <div className="border border-dashed border-white/14 bg-black/20 p-8">
            <BookOpenText className="size-5 text-[#8f9aff]" />
            <h2 className="mt-10 text-2xl font-semibold tracking-normal">
              No courses yet.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#918a82]">
              Create your first course plan and it will appear here with
              progress and chapter counts.
            </p>
            <Button
              asChild
              className="mt-6 h-10 border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
              variant="outline"
            >
              <Link href="/create">
                Create from topic
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        )}

        {!isPending && !isError && courses.length > 0 && (
          <div className="grid gap-3">
            {courses.map((course) => (
              <Link
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7887ff]"
                href={`/dashboard/courses/${course.id}`}
                key={course.id}
              >
                <motion.article
                  className="group border border-white/10 bg-black/20 p-5 transition-all hover:-translate-y-1 hover:border-[#7887ff]/35 hover:bg-[#7887ff]/[0.07]"
                  transition={transition}
                  variants={fadeUp}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-medium leading-snug text-[#f4f1ea]">
                          {course.title}
                        </h2>
                        <span className="border border-[#7887ff]/30 bg-[#7887ff]/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#aab2ff]">
                          {course.status.toLowerCase()}
                        </span>
                      </div>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#9d968e]">
                        {course.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#77716a]">
                        <span className="inline-flex items-center gap-1.5">
                          <BookOpenText className="size-3.5 text-[#8f9aff]" />
                          {course._count.chapters} chapters
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="size-3.5 text-[#8f9aff]" />
                          Updated{' '}
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="w-full lg:w-56">
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
              </Link>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

function StatBlock({
  label,
  loading,
  value,
}: {
  label: string;
  loading: boolean;
  value: number;
}) {
  return (
    <div className="border-r border-white/10 p-5 last:border-r-0 sm:p-6">
      <p className="font-mono text-4xl text-[#f4f1ea]">
        {loading ? '...' : value}
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f9aff]">
        {label}
      </p>
    </div>
  );
}
