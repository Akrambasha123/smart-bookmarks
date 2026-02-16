"use client";

import { useState } from "react";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ui/ToastProvider";

export function LoginButton() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      showToast({
        title: "Sign in failed",
        description: error.message,
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <span className="rounded-full bg-white p-0.5 shadow-sm">
        {/* Uses local asset so the button has a real Google brand mark */}
        <Image src="/google-logo.svg" alt="Google logo" width={18} height={18} />
      </span>
      {loading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
