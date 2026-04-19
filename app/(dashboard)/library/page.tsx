"use client";

import AudioPlayer from "@/components/story/audio-player";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Story = {
  id: string;
  audio_url: string;
  story_text: string;
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

        if (error) {
          throw error;
        }
        if (!user) return;

        const { data: storiesData, error: storiesError } = await supabase
          .from("stories")
          .select("id, story_text, audio_url")
          .eq("user_id", user.id);

        if (storiesError) {
          throw storiesError;
        }
        setStories(storiesData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
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
      if (err instanceof Error) {
        setError(err.message);
      }
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1>This is the library page</h1>
      {stories.map((story) => (
        <div key={story.id}>
          <p>{story.story_text}</p>
          <AudioPlayer src={story.audio_url} />
          <Button
            variant="destructive"
            disabled={deletingId === story.id}
            onClick={() => handleDelete(story.id, story.audio_url)}
          >
            {deletingId === story.id ? "Deleting..." : "Delete"}
          </Button>
          {error && <p>{error}</p>}
        </div>
      ))}
    </div>
  );
}
