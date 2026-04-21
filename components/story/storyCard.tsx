"use client";

import { useState } from "react";
import AudioPlayer from "./audio-player";

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

type StoryCardProps = {
  story: Story;
  title: string;
  description: string;
  onDelete: (id: string, audioUrl: string) => void;
  isDeleting: boolean;
  index?: number;
};

const spineColors: Record<string, string> = {
  ocean: "#C4663A",
  animals: "#C4663A",
  nature: "#7A9E7E",
  forest: "#7A9E7E",
  adventure: "#C49A3A",
  dinosaurs: "#C49A3A",
  magic: "#7A5C8A",
  robots: "#7A5C8A",
  space: "#4A6B8A",
  family: "#E8A882",
  friendship: "#E8A882",
  fruits: "#C49A3A",
};

function getSpineColor(theme: string): string {
  // theme may be a JSON array string like '["ocean","animals"]' or a simple string
  try {
    const parsed = JSON.parse(theme);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return spineColors[parsed[0]] || "#C4663A";
    }
  } catch {
    // not JSON, treat as plain string
  }
  return spineColors[theme] || "#C4663A";
}

function getThemeLabels(theme: string): string[] {
  try {
    const parsed = JSON.parse(theme);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON
  }
  return [theme];
}

export default function StoryCard({
  story,
  title,
  description,
  onDelete,
  isDeleting,
  index = 0,
}: StoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const spineColor = getSpineColor(story.theme);
  const themeLabels = getThemeLabels(story.theme);
  const date = new Date(story.created_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="flex overflow-hidden rounded-2xl transition-all duration-200 animate-fade-up"
      style={{
        background: "white",
        border: "0.5px solid rgba(196,102,58,0.18)",
        boxShadow: "0 2px 8px rgba(196,102,58,0.06)",
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 6px 20px rgba(196,102,58,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 2px 8px rgba(196,102,58,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Spine */}
      <div
        className="w-[5px] shrink-0"
        style={{ background: spineColor }}
      />

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="mb-3">
          <h3
            className="font-heading text-[17px] leading-tight mb-1"
            style={{ color: "var(--brown)" }}
          >
            {title}
          </h3>
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "var(--brown-mid)" }}
          >
            <span>{story.child_name}</span>
            <span className="opacity-30">·</span>
            <span>{date}</span>
          </p>
        </div>

        {/* Theme tags + actions row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {themeLabels.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide"
                style={{
                  background: "var(--terra-pale)",
                  color: "var(--brown-mid)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] bg-transparent border-none cursor-pointer"
              style={{ color: "var(--brown-mid)", opacity: 0.7 }}
            >
              {expanded ? "Hide" : "Listen"}
            </button>
            <button
              onClick={() => onDelete(story.id, story.audio_url)}
              disabled={isDeleting}
              className="text-[11px] bg-transparent border-none cursor-pointer text-destructive"
              style={{ opacity: isDeleting ? 0.5 : 0.7 }}
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="animate-fade-up">
            {description && (
              <p
                className="text-xs font-light leading-relaxed mb-3"
                style={{ color: "var(--brown-mid)" }}
              >
                {description}
              </p>
            )}
            <AudioPlayer src={story.audio_url} />
          </div>
        )}
      </div>
    </div>
  );
}
