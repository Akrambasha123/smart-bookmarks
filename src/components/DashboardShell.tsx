"use client";

import { useState } from "react";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import Header from "@/components/Header";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function DashboardShell({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail?: string;
}) {
  const [recentlyAddedBookmark, setRecentlyAddedBookmark] = useState<Bookmark | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  return (
    <main className="app-shell">
        <Header userEmail={userEmail} bookmarkCount={bookmarkCount} />

        <section className="panel mb-6 px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Add new bookmark
          </h2>
          <div className="mt-4">
            <BookmarkForm onBookmarkAdded={(bookmark) => setRecentlyAddedBookmark(bookmark)} />
          </div>
        </section>

        <section className="panel px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Saved links
          </h2>
          <div className="mt-4">
          <BookmarkList
            userId={userId}
            optimisticInsert={recentlyAddedBookmark}
            onCountChange={setBookmarkCount}
          />
          </div>
        </section>
    </main>
  );
}
