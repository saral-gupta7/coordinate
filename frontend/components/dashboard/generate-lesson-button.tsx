'use client';

import { generateLessonAction } from '@/lib/actions/lesson.action';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function GenerateLessonButton({
  chapterId,
  courseId,
  hasContent,
}: {
  chapterId: string;
  courseId: string;
  hasContent: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  return (
    <button
      className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-[var(--surface)] disabled:opacity-60"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await generateLessonAction(courseId, chapterId);
          if (!result.ok) toast.error(result.error);
          else {
            await queryClient.invalidateQueries({
              queryKey: ['course-chapter', courseId, chapterId],
            });
            toast.success('Lesson is ready.');
            router.refresh();
          }
        })
      }
      type="button"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {pending
        ? 'Generating…'
        : hasContent
          ? 'Regenerate lesson'
          : 'Generate lesson'}
    </button>
  );
}
