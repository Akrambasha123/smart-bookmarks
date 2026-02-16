import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/components/LoginButton";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <main className="app-shell flex min-h-screen items-center">
      <section className="panel fade-in-up grid w-full items-center gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="section-label">Private Knowledge Hub</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl">Smart Bookmarks</h1>
          <p className="body-muted mt-4 max-w-xl">
            Save important links, keep them synced in real time, and access them from any device with one secure account.
          </p>
          <div className="mt-7">
            <LoginButton />
          </div>
        </div>

        <div className="panel-soft p-5">
          <div className="mb-4 flex items-center gap-2">
            <Image src="/window.svg" alt="preview" width={18} height={18} />
            <p className="section-label">Quick Overview</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-semibold">Realtime Sync</p>
              <p className="body-muted mt-1 text-sm">Changes instantly reflect across browser tabs.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-semibold">Private Storage</p>
              <p className="body-muted mt-1 text-sm">Your bookmarks are scoped to your own account.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-semibold">Fast Search</p>
              <p className="body-muted mt-1 text-sm">Find links instantly by title or URL.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
