"use client";

import StoryCard from "@/components/story/storyCard";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Story = {
  id: string;
  audio_url: string;
  story_text: string;
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
          .select("id, story_text, audio_url, child_name, theme, created_at")
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
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-1">Your library</h1>
          <p className="text-muted-foreground text-sm">
            All the stories you have saved.
          </p>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {stories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No stories saved yet. Generate one and save it.
          </p>
        ) : (
          <div className="space-y-4">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={handleDelete}
                isDeleting={deletingId === story.id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
