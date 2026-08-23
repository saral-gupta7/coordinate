import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-10 grid-cols-2 gap-[3px] rounded-[10px] bg-[var(--ink)] p-[7px] text-[var(--surface)]',
        className,
      )}
    >
      <span className="rounded-tl-full rounded-br-sm bg-current" />
      <span className="rounded-tr-sm rounded-bl-full bg-current" />
      <span className="rounded-tl-sm rounded-br-full bg-current" />
      <span className="rounded-tr-full rounded-bl-sm bg-current" />
    </span>
  );
}
