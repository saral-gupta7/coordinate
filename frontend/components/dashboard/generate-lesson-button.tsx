'use client';

import { Button } from '@/components/ui/button';
import { generateLessonAction } from '@/lib/actions/lesson.action';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

type GenerateLessonButtonProps = {
  courseId: string;
  chapterId: string;
  hasContent: boolean;
};

export function GenerateLessonButton({
  courseId,
  chapterId,
  hasContent,
}: GenerateLessonButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="h-9 border-white/12 bg-white/[0.035] text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await generateLessonAction(courseId, chapterId);

          if (result.ok) {
            router.refresh();
          }
        });
      }}
      type="button"
      variant="outline"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Sparkles className="size-4" />
      )}
      {hasContent ? 'Regenerate lesson' : 'Generate lesson'}
    </Button>
  );
}
