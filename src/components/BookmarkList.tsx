"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ui/ToastProvider";
import ConfirmationModal from "@/components/ConfirmationModal";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function BookmarkList({
  userId,
  refreshKey = 0,
  onCountChange,
}: {
  userId: string;
  refreshKey?: number;
  onCountChange?: (count: number) => void;
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [modalBookmark, setModalBookmark] = useState<Bookmark | null>(null);
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const { showToast } = useToast();

  useEffect(() => {
    onCountChange?.(bookmarks.length);
  }, [bookmarks.length, onCountChange]);

  useEffect(() => {
    let isMounted = true;

    async function fetchBookmarks() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        showToast({
          title: "Could not load bookmarks",
          description: error.message,
          type: "error",
        });
      }
      setBookmarks(data || []);
      setLoading(false);
    }

    fetchBookmarks();

    // Keep all tabs in sync through Supabase realtime events.
    const channel = supabase
      .channel(`bookmarks-changes-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (!isMounted) return;

          if (payload.eventType === "INSERT") {
            const incoming = payload.new as Bookmark;
            setBookmarks((prev) => {
              if (prev.some((item) => item.id === incoming.id)) return prev;
              return [incoming, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const incoming = payload.new as Bookmark;
            setBookmarks((prev) =>
              prev.map((item) => (item.id === incoming.id ? incoming : item))
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as Bookmark;
            setBookmarks((prev) => prev.filter((item) => item.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, refreshKey, showToast]);

  const visibleBookmarks = useMemo(() => {
    const filtered = bookmarks.filter((bookmark) => {
      const haystack = `${bookmark.title} ${bookmark.url}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return sorted;
  }, [bookmarks, query, sort]);

  const requestDelete = (bookmark: Bookmark) => {
    setModalBookmark(bookmark);
  };

  const confirmDelete = async () => {
    if (!modalBookmark) return;

    const target = modalBookmark;
    const originalIndex = bookmarks.findIndex((item) => item.id === target.id);

    setPendingDeleteId(target.id);
    setModalBookmark(null);

    // Optimistic delete: remove immediately for responsive UX.
    setBookmarks((prev) => prev.filter((item) => item.id !== target.id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", target.id);
    setPendingDeleteId(null);

    if (!error) {
      showToast({ title: "Bookmark deleted", type: "success" });
      return;
    }

    // Rollback if backend delete fails.
    setBookmarks((prev) => {
      if (prev.some((item) => item.id === target.id)) return prev;
      const safeIndex = Math.max(0, Math.min(originalIndex, prev.length));
      const next = [...prev];
      next.splice(safeIndex, 0, target);
      return next;
    });
    showToast({ title: "Delete failed", description: error.message, type: "error" });
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast({ title: "Link copied", description: "Copied to clipboard.", type: "success" });
    } catch {
      showToast({
        title: "Copy failed",
        description: "Clipboard permission is blocked.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 py-2">
        <div className="body-muted flex items-center gap-2 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400/40 border-t-current" />
          Loading bookmarks...
        </div>
        <div className="panel-soft h-16 animate-pulse" />
        <div className="panel-soft h-16 animate-pulse" />
        <div className="panel-soft h-16 animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or URL"
            className="input-base"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "newest" | "oldest" | "title")}
            className="input-base"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>

        {visibleBookmarks.length === 0 ? (
          <p className="body-muted rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm dark:border-gray-600">
            No bookmarks found for your current filter.
          </p>
        ) : (
          visibleBookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="panel-soft card-hover fade-in-up p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-base font-semibold hover:underline"
                  >
                    {bookmark.title}
                  </a>
                  <p className="body-muted mt-1 break-all text-sm">{bookmark.url}</p>
                </div>
                <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center">
                  <button
                    type="button"
                    onClick={() => window.open(bookmark.url, "_blank", "noopener,noreferrer")}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 3h7v7" />
                      <path d="M10 14 21 3" />
                      <path d="M21 14v7h-7" />
                      <path d="M3 10V3h7" />
                      <path d="M3 21h7" />
                    </svg>
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => copyLink(bookmark.url)}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <rect x="2" y="2" width="13" height="13" rx="2" />
                    </svg>
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(bookmark)}
                    disabled={pendingDeleteId === bookmark.id}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                    </svg>
                    {pendingDeleteId === bookmark.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <ConfirmationModal
        open={Boolean(modalBookmark)}
        title="Delete bookmark?"
        description={
          modalBookmark
            ? `This action permanently removes "${modalBookmark.title}" from your list. You can add it again later if needed.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        loading={Boolean(modalBookmark && pendingDeleteId === modalBookmark.id)}
        onCancel={() => setModalBookmark(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
