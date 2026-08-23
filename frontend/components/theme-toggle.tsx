'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`focus-ring inline-flex size-10 items-center justify-center rounded-full border bg-[var(--surface)] text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] ${className}`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      type="button"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
