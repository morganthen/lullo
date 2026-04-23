"use client";

import StoryCard from "@/components/story/storyCard";
import { createClient } from "@/lib/supabase/client";
import { Suspense, use, useEffect, useState } from "react";
import { SleepingCharacterSvg } from "@/components/ui/brand-svgs";
import Link from "next/link";

type Story = {
  id: string;
  audio_url: string;
  story: string;
  title: string;
  description: string;
  child_name: string;
  theme: string;
  created_at: string;
};

async function fetchStories(userId: string): Promise<Story[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select(
      "id, story, title, description, audio_url, child_name, theme, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export default function LibraryPage() {
  const [count, setCount] = useState<number | null>(null);
  const [storiesPromise, setStoriesPromise] = useState<Promise<
    Story[]
  > | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        const { count: c, error: countError } = await supabase
          .from("stories")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (countError) throw countError;

        const resolved = c ?? 0;
        if (resolved > 0) {
          setStoriesPromise(fetchStories(user.id));
        }
        setCount(resolved);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        console.error(err);
      }
    }
    init();
  }, []);

  return (
    <main className="animate-page-enter">
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-20">
        <div className="flex items-baseline justify-between mb-9">
          <div>
            <p
              className="font-heading text-[13px] tracking-wide mb-1.5"
              style={{ color: "var(--terra-light)" }}
            >
              ✦ Your shelf
            </p>
            <h1
              className="font-heading text-[38px]"
              style={{ color: "var(--brown)" }}
            >
              Your library
            </h1>
          </div>
          <Link
            href="/generate"
            className="font-heading text-sm text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 no-underline"
            style={{
              background: "var(--terra)",
              boxShadow: "0 2px 12px rgba(196,102,58,0.22)",
            }}
          >
            + New story
          </Link>
        </div>

        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        {count === 0 && <EmptyState />}

        {count !== null && count > 0 && storiesPromise && (
          <Suspense fallback={<StoriesSkeleton count={count} />}>
            <StoriesList promise={storiesPromise} />
          </Suspense>
        )}
      </div>
    </main>
  );
}

function StoriesList({ promise }: { promise: Promise<Story[]> }) {
  const initial = use(promise);
  const [stories, setStories] = useState<Story[]>(initial);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  async function handleDelete(storyId: string, audioUrl: string) {
    try {
      setDeletingId(storyId);
      await fetch("/api/delete-story", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, audioUrl }),
      });
      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  if (stories.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {error && <p className="text-destructive text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map((story, idx) => (
          <StoryCard
            key={story.id}
            title={story.title}
            description={story.description}
            story={story}
            onDelete={handleDelete}
            isDeleting={deletingId === story.id}
            index={idx}
          />
        ))}
      </div>
    </>
  );
}

function StoriesSkeleton({ count }: { count: number }) {
  const placeholders = Array.from({ length: Math.min(count, 6) });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {placeholders.map((_, i) => (
        <div
          key={i}
          className="rounded-2xl h-48 animate-pulse"
          style={{
            background: "var(--terra-pale)",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-md mx-auto text-center pt-12 animate-page-enter">
      <div className="mb-7 animate-float inline-block">
        <SleepingCharacterSvg />
      </div>
      <h2
        className="font-heading text-[30px] mb-2.5 animate-fade-up"
        style={{ color: "var(--brown)", animationDelay: "0.2s" }}
      >
        Your shelf is waiting
      </h2>
      <p
        className="text-sm font-light leading-relaxed mb-8 animate-fade-up"
        style={{ color: "var(--brown-mid)", animationDelay: "0.32s" }}
      >
        Every story you save will live here — ready to listen to again on any
        night.
      </p>
      <div className="animate-fade-up" style={{ animationDelay: "0.44s" }}>
        <Link
          href="/generate"
          className="font-heading text-sm text-white px-6 py-3 rounded-xl inline-block transition-opacity hover:opacity-90 no-underline"
          style={{
            background: "var(--terra)",
            boxShadow: "0 2px 12px rgba(196,102,58,0.22)",
          }}
        >
          Write the first story →
        </Link>
      </div>
    </div>
  );
}
