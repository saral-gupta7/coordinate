'use client';

import { BrandMark } from '@/components/brand-mark';
import { ModeToggle } from '@/components/theme-toggle';
import { authClient } from '@/lib/auth-client';
import { RiGithubFill, RiGoogleFill } from '@remixicon/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [pending, setPending] = useState<'google' | 'github' | null>(null);
  const [signInError, setSignInError] = useState('');

  async function signIn(provider: 'google' | 'github') {
    setPending(provider);
    setSignInError('');
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/dashboard',
        fetchOptions: {
          onError: ({ error }) => {
            const message =
              error.message ||
              'Sign-in is temporarily unavailable. Check your connection and try again.';
            setSignInError(message);
            toast.error(message);
            setPending(null);
          },
        },
      });
    } catch {
      const message =
        'Sign-in is temporarily unavailable. Check your connection and try again.';
      setSignInError(message);
      toast.error(message);
      setPending(null);
    }
  }

  return (
    <main className="grid min-h-svh bg-(--canvas) lg:grid-cols-[1.08fr_0.92fr]">
      <section className="hairline-grid relative hidden border-r p-10 lg:flex lg:flex-col">
        <Link
          className="flex items-center gap-3 text-xl font-semibold tracking-[-0.04em]"
          href="/"
        >
          <BrandMark /> coordinate.
        </Link>
        <div className="my-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--accent-strong)">
            Welcome back
          </p>
          <h1 className="mt-6 text-[clamp(3.5rem,6vw,6.7rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
            Return to your
            <span className="editorial-serif block text-(--accent-strong)">
              learning map.
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-(--muted)">
            Your courses, generated lessons, and chapter quizzes are waiting in
            one focused workspace.
          </p>
        </div>
      </section>

      <section className="flex min-h-svh flex-col p-5 sm:p-8">
        <header className="flex items-center justify-between lg:justify-end">
          <Link
            className="focus-ring inline-flex items-center gap-2 text-sm text-(--muted) lg:hidden"
            href="/"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <ModeToggle />
        </header>
        <div className="m-auto w-full max-w-md rounded-[28px] border bg-(--surface) p-7 shadow-(--shadow) sm:p-10">
          <BrandMark className="mb-10" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--accent-strong)">
            Sign in
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
            Open your workspace.
          </h2>
          <p className="mt-4 text-sm leading-6 text-(--muted)">
            Continue with the account you use for Coordinate.
          </p>

          <div className="mt-9 grid gap-3">
            <SocialButton
              disabled={pending !== null}
              onClick={() => signIn('google')}
            >
              <RiGoogleFill className="size-5" />
              {pending === 'google' ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                'Continue with Google'
              )}
            </SocialButton>
            <SocialButton
              disabled={pending !== null}
              onClick={() => signIn('github')}
            >
              <RiGithubFill className="size-5" />
              {pending === 'github' ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Connecting…
                </>
              ) : (
                'Continue with GitHub'
              )}
            </SocialButton>
          </div>
          {signInError && (
            <p
              aria-live="assertive"
              className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--danger)_35%,var(--line))] bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-[var(--danger)]"
              role="alert"
            >
              {signInError}
            </p>
          )}
          <Link
            className="focus-ring mt-8 inline-flex items-center gap-2 text-sm text-(--muted) hover:text-(--ink)"
            href="/"
          >
            <ArrowLeft className="size-4" />
            Back to Coordinate
          </Link>
        </div>
      </section>
    </main>
  );
}

function SocialButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="focus-ring flex h-13 items-center justify-center gap-3 rounded-full border bg-[var(--surface)] px-5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)] disabled:opacity-60"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
