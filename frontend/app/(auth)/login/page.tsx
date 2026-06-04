"use client";

import Link from "next/link";
import { useState } from "react";
import { RiGithubFill, RiGoogleFill } from "@remixicon/react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, BookOpenText, CheckCircle2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const benefits = ["Personal course maps", "Course-aware tutor", "Document-grounded lessons"];

const LoginPage = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [pendingProvider, setPendingProvider] = useState<"google" | "github" | null>(null);

  const handleSocialLogin = async (provider: "google" | "github") => {
    setPendingProvider(provider);

    try {
      await authClient.signIn.social({
        provider,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed in. Redirecting...");
            router.push("/");
          },
          onError: ({ error }) => {
            toast.error(error.message || "Failed to sign in. Please try again later.");
            setPendingProvider(null);
          },
        },
      });
    } catch {
      toast.error("Failed to sign in. Please try again later.");
      setPendingProvider(null);
    }
  };

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#07080a] text-[#f4f1ea] selection:bg-[#7887ff] selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.075)_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 [background:repeating-linear-gradient(135deg,rgba(255,255,255,.026)_0,rgba(255,255,255,.026)_1px,transparent_1px,transparent_8px)]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: ["-58%", "-42%", "-58%"], opacity: [0.25, 0.9, 0.25] }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 h-px w-[64rem] bg-gradient-to-r from-transparent via-[#7887ff]/45 to-transparent"
        transition={reduceMotion ? undefined : { duration: 11, ease: "easeInOut", repeat: Infinity }}
      />

      <header className="relative z-10 border-b border-white/10 bg-[#07080a]/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link className="group flex items-center gap-2 text-sm font-semibold" href="/">
            <span className="flex size-7 items-center justify-center border border-white/14 bg-white/[0.04] transition-colors group-hover:border-[#7887ff]/50 group-hover:bg-[#7887ff]/10">
              <Sparkles className="size-4 transition-transform group-hover:scale-110" />
            </span>
            Coordinate
          </Link>

          <Button asChild className="text-[#b8b4ad] hover:bg-white/[0.06] hover:text-white" size="sm" variant="ghost">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Home
            </Link>
          </Button>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.22em] text-[#8f9aff]">
            Access your learning map
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-normal text-[#f4f1ea] sm:text-6xl">
            Pick up exactly where your course left off.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#a7a199]">
            Sign in to generate course plans, study lessons, ask the tutor, and keep your documents connected to the
            path.
          </p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid max-w-xl gap-3"
            initial={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          >
            {benefits.map((benefit) => (
              <div className="flex items-center gap-3 border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-[#c7c1b9]" key={benefit}>
                <CheckCircle2 className="size-4 text-[#8f9aff]" />
                {benefit}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.section
          animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
          className="flex items-center lg:justify-end"
          initial={{ opacity: 0, y: 24 }}
          transition={
            reduceMotion
              ? { duration: 0.55, ease: "easeOut" }
              : {
                  opacity: { duration: 0.55, delay: 0.08, ease: "easeOut" },
                  y: { duration: 5.4, ease: "easeInOut", repeat: Infinity },
                }
          }
        >
          <div className="w-full max-w-md border border-white/12 bg-[#0d0e11]/95 shadow-2xl shadow-black/60">
            <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#77716a]">Sign in</div>
              <div className="rounded-sm border border-[#6f7dff]/30 bg-[#6f7dff]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#aab2ff]">
                Secure
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="mb-8 flex size-12 items-center justify-center border border-white/10 bg-white/[0.04]">
                <BookOpenText className="size-5 text-[#8f9aff]" />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-normal text-[#f4f1ea]">Find your Coordinate</h2>
                <p className="text-sm leading-6 text-[#918a82]">
                  Continue with your preferred account and open your adaptive learning workspace.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  className="group h-12 w-full justify-start border-white/12 bg-white/[0.035] text-[#f4f1ea] transition-transform hover:-translate-y-0.5 hover:border-[#7887ff]/35 hover:bg-white/[0.065]"
                  disabled={pendingProvider !== null}
                  onClick={() => handleSocialLogin("google")}
                  size="lg"
                  variant="outline"
                >
                  <RiGoogleFill className="size-5" aria-hidden="true" />
                  <span className="flex-1 text-center">
                    {pendingProvider === "google" ? "Connecting..." : "Sign in with Google"}
                  </span>
                </Button>
                <Button
                  className="group h-12 w-full justify-start border-white/12 bg-white/[0.035] text-[#f4f1ea] transition-transform hover:-translate-y-0.5 hover:border-[#7887ff]/35 hover:bg-white/[0.065]"
                  disabled={pendingProvider !== null}
                  onClick={() => handleSocialLogin("github")}
                  size="lg"
                  variant="outline"
                >
                  <RiGithubFill className="size-5" aria-hidden="true" />
                  <span className="flex-1 text-center">
                    {pendingProvider === "github" ? "Connecting..." : "Sign up with GitHub"}
                  </span>
                </Button>
              </div>

              <p className="mt-7 text-xs leading-5 text-[#77716a]">
                By signing in, you agree to our{" "}
                <Link className="font-medium text-[#d8d2ca] underline-offset-4 hover:underline" href="/terms">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link className="font-medium text-[#d8d2ca] underline-offset-4 hover:underline" href="/privacy">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
};

export default LoginPage;
