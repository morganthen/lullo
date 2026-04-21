"use client";

import StoryCard from "@/components/story/storyCard";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
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

export default function LibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function getStories() {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) return;

        const { data: storiesData, error: storiesError } = await supabase
          .from("stories")
          .select(
            "id, story, title, description, audio_url, child_name, theme, created_at",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (storiesError) throw storiesError;
        setStories(storiesData);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        console.error(err);
      }
    }
    getStories();
  }, []);

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

  return (
    <main className="animate-page-enter">
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-20">
        {/* Header */}
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

        {stories.length === 0 ? (
          /* Empty state */
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
              Every story you save will live here — ready to listen to again on
              any night.
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
        ) : (
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
        )}
      </div>
    </main>
  );
}
