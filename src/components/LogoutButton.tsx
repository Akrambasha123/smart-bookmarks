"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ui/ToastProvider";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const handleLogout = async () => {
    setLoading(true);
    // Sign out from Supabase and redirect to home.
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast({ title: "Logout failed", description: error.message, type: "error" });
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}
