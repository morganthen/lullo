"use client";

import AudioPlayer from "./audio-player";
import { Button } from "@/components/ui/button";

type Story = {
  id: string;
  audio_url: string;
  story_text: string;
  child_name: string;
  theme: string;
  created_at: string;
};

type StoryCardProps = {
  story: Story;
  onDelete: (id: string, audioUrl: string) => void;
  isDeleting: boolean;
};

export default function StoryCard({
  story,
  onDelete,
  isDeleting,
}: StoryCardProps) {
  const preview = story.story_text.slice(0, 120) + "...";
  const date = new Date(story.created_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-card border rounded-2xl p-5 space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-lg font-semibold">
              {story.child_name}&apos;s story
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {story.theme} · {date}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDeleting}
            onClick={() => onDelete(story.id, story.audio_url)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {preview}
        </p>
      </div>
      <AudioPlayer src={story.audio_url} />
    </div>
  );
}
