"use client";

import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useToast } from "@/components/ui/ToastProvider";

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  // Make input user-friendly by auto-prefixing protocol when omitted.
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function getUrlValidationMessage(input: string) {
  if (!input.trim()) return "URL is required.";
  const normalized = normalizeUrl(input);
  try {
    const parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "Please use a valid http/https URL.";
    }
    return "";
  } catch {
    return "Please enter a valid URL.";
  }
}

export default function BookmarkForm({
  onBookmarkAdded,
}: {
  onBookmarkAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [titleError, setTitleError] = useState("");
  const [urlError, setUrlError] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const validate = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    const nextUrlError = getUrlValidationMessage(url);
    setUrlError(nextUrlError);
    if (nextUrlError) valid = false;

    return valid;
  };

  const handleUrlBlur = () => {
    if (!url.trim()) return;
    const normalized = normalizeUrl(url);
    setUrl(normalized);
    setUrlError(getUrlValidationMessage(normalized));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      showToast({ title: "Validation failed", description: "Fix form errors.", type: "error" });
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      showToast({
        title: "Session error",
        description: userError?.message ?? "Please sign in again.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: normalizedUrl,
      user_id: user.id,
    });

    if (error) {
      showToast({ title: "Could not save bookmark", description: error.message, type: "error" });
      setLoading(false);
      return;
    }

    setTitle("");
    setUrl("");
    setTitleError("");
    setUrlError("");
    showToast({ title: "Bookmark saved", description: "Your link is now synced.", type: "success" });
    onBookmarkAdded?.();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Title
          </span>
          <input
            type="text"
            placeholder="Product docs"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError(event.target.value.trim() ? "" : "Title is required.");
            }}
            className="input-base"
          />
          {titleError ? <p className="text-xs text-red-600">{titleError}</p> : null}
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            URL
          </span>
          <input
            type="text"
            inputMode="url"
            placeholder="example.com or https://example.com"
            value={url}
            onBlur={handleUrlBlur}
            onChange={(event) => {
              setUrl(event.target.value);
              if (urlError) setUrlError(getUrlValidationMessage(event.target.value));
            }}
            className="input-base"
          />
          {urlError ? <p className="text-xs text-red-600">{urlError}</p> : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Saving...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Add Bookmark
          </span>
        )}
      </button>
    </form>
  );
}
