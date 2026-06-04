import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
    } catch (error) {}
  };
  return (
    <Button
      aria-label="Log out"
      className="h-9 border-white/12 bg-white/[0.035] px-3 text-[#d8d2ca] hover:bg-white/[0.075] hover:text-white"
      variant="outline"
      onClick={handleSignOut}
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
    // <button
    //   className="rounded-sm bg-red-400 text-white px-2 py-3"
    //   onClick={handleSignOut}
    // >
    //   Sign Out
    // </button>
  );
};

export default SignOut;
