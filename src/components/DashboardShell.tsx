"use client";

import { useState } from "react";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import Header from "@/components/Header";

export default function DashboardShell({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail?: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  return (
    <main className="app-shell">
        <Header userEmail={userEmail} bookmarkCount={bookmarkCount} />

        <section className="panel mb-6 px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Add new bookmark
          </h2>
          <div className="mt-4">
            <BookmarkForm onBookmarkAdded={() => setRefreshKey((v) => v + 1)} />
          </div>
        </section>

        <section className="panel px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Saved links
          </h2>
          <div className="mt-4">
          <BookmarkList
            userId={userId}
            refreshKey={refreshKey}
            onCountChange={setBookmarkCount}
          />
          </div>
        </section>
    </main>
  );
}
