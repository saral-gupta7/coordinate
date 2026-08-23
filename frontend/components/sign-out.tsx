import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Sign Out sucessful!");
            router.push("/");
          },
          onError: ({ error }) => {
            toast.error(
              error.message || "Failed to sign out. Please try again later!",
            );
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      aria-label="Log out"
      className="focus-ring inline-flex size-10 items-center justify-center rounded-full border bg-[var(--surface)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--ink)]"
      onClick={handleSignOut}
      type="button"
    >
      <LogOut className="size-4" />
    </button>
  );
};

export default SignOut;
