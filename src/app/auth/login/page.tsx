"use client";

import Image from "next/image";
import { LoginButton } from "@/components/LoginButton";

export default function LoginPage() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center">
      <section className="panel fade-in-up w-full max-w-xl px-6 py-8 text-center sm:px-10 sm:py-10">
        <div className="panel-soft mx-auto mb-4 flex w-fit items-center justify-center p-3">
          <Image src="/globe.svg" alt="Smart bookmarks logo" width={34} height={34} />
        </div>
        <h1 className="text-3xl font-bold">Smart Bookmarks</h1>
        <p className="body-muted mt-3 text-sm sm:text-base">Save and sync your links privately.</p>
        <div className="mt-8 flex justify-center">
          <LoginButton />
        </div>
        <p className="body-muted mt-6 text-xs">
          Authentication is secured with Supabase OAuth.
        </p>
      </section>
    </main>
  );
}
