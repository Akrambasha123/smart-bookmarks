"use client";

import LogoutButton from "@/components/LogoutButton";

export default function Header({
  userEmail,
  bookmarkCount,
}: {
  userEmail?: string;
  bookmarkCount: number;
}) {
  return (
    <header className="panel fade-in-up mb-6 px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-label">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold">Smart Bookmarks</h1>
          <p className="body-muted mt-2 break-all text-sm">
            Welcome back, <span className="font-semibold">{userEmail ?? "User"}</span>
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 md:w-auto md:justify-end">
          <div className="panel-soft inline-flex items-center gap-2 px-4 py-2.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="m7 14 3-3 3 2 4-5" />
            </svg>
            <div>
              <p className="section-label !text-[10px]">Total Links</p>
              <p className="text-lg font-bold leading-none">{bookmarkCount}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
