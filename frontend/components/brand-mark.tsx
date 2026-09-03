import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-9 place-items-center rounded-[11px] bg-[var(--ink)] text-[var(--surface)]',
        className,
      )}
    >
      <svg
        className="size-[68%]"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 18.5h12M8.5 21V6"
          opacity="0.72"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <circle
          cx="15.5"
          cy="9.5"
          fill="var(--accent)"
          r="3"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    </span>
  );
}
