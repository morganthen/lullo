"use client";

import { useEffect, useState } from "react";
import { Theme, themes } from "@/lib/themes";
import { StoryFormData } from "@/types/story";
import AudioPlayer from "@/components/story/audio-player";
import { getUserProfile } from "@/lib/supabase/getUserProfile";
import { OpenBookSvg } from "@/components/ui/brand-svgs";

const FREE_TIER_ALLOWANCE = 3;

const themeEmoji: Record<string, string> = {
  space: "🚀",
  ocean: "🌊",
  animals: "🦊",
  magic: "✨",
  dinosaurs: "🦕",
  forest: "🌿",
  robots: "🤖",
  family: "🏡",
  friendship: "🤝",
  fruits: "🍓",
};

const ages = [
  { value: "5", label: "Under 5" },
  { value: "8", label: "Under 8" },
  { value: "12", label: "Under 12" },
];

const narratorOptions = [
  { id: "warm", label: "Warm & Calm", desc: "Soft, unhurried" },
  { id: "playful", label: "Playful", desc: "Light and bright" },
  { id: "gentle", label: "Gentle", desc: "Slow and soothing" },
  { id: "cute", label: "Cute", desc: "Sweet and warm" },
];

const loadingSteps = [
  "Gathering the magic...",
  "Writing the story...",
  "Narrating the words...",
];

export default function GeneratePage() {
  const [childName, setChildName] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [feeling, setFeeling] = useState<string>("");
  const [narrator, setNarrator] = useState<string>("warm");
  const [story, setStory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [plan, setPlan] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<number>(0);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setPlan(profile.plan);
        setGenerationsUsed(profile.generations_used);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(
      () => setLoadingStep((p) => (p + 1) % loadingSteps.length),
      1800,
    );
    return () => clearInterval(interval);
  }, [isLoading]);

  function toggleTheme(t: Theme): void {
    setSelectedThemes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t],
    );
  }

  async function generateStory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (audioUrl && !isSaved) {
      const confirmed = window.confirm(
        "You have an unsaved story. Generating a new one will lose it. Continue?",
      );
      if (!confirmed) return;
    }
    setGenerationsUsed((prev) => prev + 1);
    setAudioUrl("");
    setAudioBlob(null);
    setStory("");
    setIsSaved(false);
    setError("");
    setIsLoading(true);
    setLoadingStep(0);

    if (!childName || !ageRange || !selectedThemes.length || !narrator) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const formData: StoryFormData = {
      childName,
      ageRange,
      selectedThemes,
      feeling,
      narrator,
    };

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate story");
      }
      setStory(data.story);
      setTitle(data.title);
      setDescription(data.description);

      const audioResponse = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: data.story, narrator }),
      });

      if (!audioResponse.ok) {
        const errorData = await audioResponse.json();
        throw new Error(errorData.error ?? "Failed to generate audio");
      }
      const blob = await audioResponse.blob();
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveStory() {
    if (plan === "free") {
      setError("Upgrade to Lullo Plus to save your stories.");
      return;
    }
    if (!audioBlob) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "story.mp3");
      formData.append("childName", childName);
      formData.append("story", story);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ageRange", ageRange);
      formData.append("selectedThemes", JSON.stringify(selectedThemes));
      formData.append("feeling", feeling);
      formData.append("narrator", narrator);

      const response = await fetch("/api/save-story", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to save story");
      }
      setIsSaved(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error("Error saving story:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const canSubmit = childName && ageRange && selectedThemes.length && narrator;

  // Loading state
  if (isLoading) {
    return (
      <main className="animate-page-enter">
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="mb-6 animate-float">
            <OpenBookSvg />
          </div>
          <h2
            className="font-heading text-[28px] mb-2"
            style={{ color: "var(--brown)" }}
          >
            Writing the story
          </h2>
          <div className="flex justify-center gap-1.5 mb-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-dot-bounce"
                style={{
                  background: "var(--terra)",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          <p
            className="text-[13px] italic font-light transition-opacity duration-500"
            style={{ color: "var(--brown-mid)" }}
          >
            {loadingSteps[loadingStep]}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="animate-page-enter">
      <div className="max-w-[560px] mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <p
          className="font-heading text-[13px] tracking-wide mb-2.5 animate-fade-up"
          style={{ color: "var(--terra-light)", animationDelay: "0.05s" }}
        >
          ✦ Tonight&apos;s story
        </p>
        <h1
          className="font-heading text-[38px] leading-[1.15] mb-1.5 animate-fade-up"
          style={{ color: "var(--brown)", animationDelay: "0.12s" }}
        >
          What story shall we
          <br />
          tell tonight?
        </h1>
        <p
          className="text-sm font-light mb-10 animate-fade-up"
          style={{ color: "var(--brown-mid)", animationDelay: "0.2s" }}
        >
          Fill in the details — we&apos;ll do the rest.
        </p>

        {plan === "free" && (
          <p
            className="text-sm mb-6"
            style={{ color: "var(--brown-mid)" }}
          >
            {generationsUsed >= FREE_TIER_ALLOWANCE
              ? "You have no free stories left this month."
              : `${FREE_TIER_ALLOWANCE - generationsUsed} free stories remaining this month.`}
          </p>
        )}

        <form onSubmit={generateStory} className="space-y-7">
          {/* Child's name */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.28s" }}
          >
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1.5"
              style={{ color: "var(--brown-mid)" }}
            >
              Child&apos;s name
            </label>
            <input
              className="w-full px-3.5 py-3 text-sm rounded-lg outline-none transition-colors"
              style={{
                color: "var(--brown)",
                background: "white",
                border: "1px solid rgba(196,102,58,0.22)",
              }}
              placeholder="e.g. Mia"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>

          {/* Age segmented control */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.36s" }}
          >
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1.5"
              style={{ color: "var(--brown-mid)" }}
            >
              Age
            </label>
            <div
              className="inline-flex rounded-xl p-[3px]"
              style={{
                background: "var(--terra-pale)",
                border: "0.5px solid rgba(196,102,58,0.18)",
              }}
            >
              {ages.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAgeRange(a.value)}
                  className="text-[13px] px-[18px] py-2 rounded-lg transition-all cursor-pointer border-none"
                  style={{
                    fontWeight: ageRange === a.value ? 600 : 400,
                    color:
                      ageRange === a.value ? "white" : "var(--brown-mid)",
                    background:
                      ageRange === a.value ? "var(--terra)" : "transparent",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme chips */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.44s" }}
          >
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1.5"
              style={{ color: "var(--brown-mid)" }}
            >
              Story theme
            </label>
            <div className="flex flex-wrap gap-2">
              {themes.map((theme) => {
                const on = selectedThemes.includes(theme);
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => toggleTheme(theme)}
                    className="text-[13px] px-3.5 py-[7px] rounded-full flex items-center gap-1.5 cursor-pointer transition-all"
                    style={{
                      fontWeight: on ? 500 : 400,
                      color: on ? "var(--terra)" : "var(--brown-mid)",
                      background: on ? "var(--terra-pale)" : "white",
                      border: on
                        ? "1.5px solid rgba(196,102,58,0.5)"
                        : "1px solid rgba(196,102,58,0.18)",
                      animation: on ? "chipPop 0.25s ease both" : "none",
                    }}
                  >
                    <span>{themeEmoji[theme]}</span>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feeling */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.52s" }}
          >
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1.5"
              style={{ color: "var(--brown-mid)" }}
            >
              How are they feeling?{" "}
              <span className="normal-case font-light tracking-normal">
                (optional)
              </span>
            </label>
            <input
              className="w-full px-3.5 py-3 text-sm rounded-lg outline-none transition-colors"
              style={{
                color: "var(--brown)",
                background: "white",
                border: "1px solid rgba(196,102,58,0.22)",
              }}
              placeholder="e.g. nervous about school tomorrow"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
          </div>

          {/* Narrator voice cards */}
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            <label
              className="block text-xs font-medium uppercase tracking-wide mb-1.5"
              style={{ color: "var(--brown-mid)" }}
            >
              Narrator voice
            </label>
            <div className="flex gap-2.5">
              {narratorOptions.map((n) => {
                const on = narrator === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNarrator(n.id)}
                    className="flex-1 text-center px-2 py-2.5 rounded-xl cursor-pointer transition-all border-none"
                    style={{
                      background: on ? "var(--terra-pale)" : "white",
                      border: on
                        ? "1.5px solid rgba(196,102,58,0.5)"
                        : "1px solid rgba(196,102,58,0.18)",
                    }}
                  >
                    <div
                      className="text-[13px] font-semibold mb-0.5"
                      style={{
                        color: on ? "var(--terra)" : "var(--brown)",
                      }}
                    >
                      {n.label}
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: "var(--brown-mid)" }}
                    >
                      {n.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full font-heading text-[17px] text-white py-3.5 rounded-xl transition-opacity cursor-pointer border-none"
            style={{
              background: "var(--terra)",
              boxShadow: "0 2px 12px rgba(196,102,58,0.22)",
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            {childName
              ? `Write ${childName}'s story →`
              : "Write tonight's story →"}
          </button>

          {!canSubmit && (
            <p
              className="text-xs text-center opacity-60"
              style={{ color: "var(--brown-mid)" }}
            >
              Add a name, age and theme to continue
            </p>
          )}
        </form>

        {error && (
          <p className="text-sm text-destructive mt-4">{error}</p>
        )}

        {/* Generated story display */}
        {story && (
          <div className="mt-8 animate-fade-up">
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-1 h-7 rounded-sm shrink-0"
                style={{ background: "var(--terra)" }}
              />
              <h2
                className="font-heading text-2xl"
                style={{ color: "var(--brown)" }}
              >
                {title}
              </h2>
            </div>
            <p
              className="text-xs pl-3 mb-4"
              style={{ color: "var(--brown-mid)" }}
            >
              {description}
            </p>
            <div
              className="max-h-[220px] overflow-y-auto p-5 rounded-2xl mb-6"
              style={{
                background: "white",
                border: "0.5px solid rgba(196,102,58,0.18)",
                boxShadow: "0 2px 10px rgba(196,102,58,0.06)",
              }}
            >
              {story.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-sm leading-[1.8] font-light"
                  style={{
                    color: "var(--brown)",
                    marginBottom:
                      i < story.split("\n\n").length - 1 ? 14 : 0,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="mt-4 space-y-3 animate-fade-up">
            <AudioPlayer src={audioUrl} />
            {plan === "plus" &&
              (isSaved ? (
                <p
                  className="text-sm text-center"
                  style={{ color: "var(--brown-mid)" }}
                >
                  Story saved.
                </p>
              ) : (
                <button
                  onClick={handleSaveStory}
                  disabled={isSaving}
                  className="w-full font-heading text-sm py-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    color: "var(--terra)",
                    background: "white",
                    border: "1px solid rgba(196,102,58,0.35)",
                    opacity: isSaving ? 0.5 : 1,
                  }}
                >
                  {isSaving ? "Saving..." : "Save story"}
                </button>
              ))}
            {plan === "free" && (
              <p
                className="text-sm text-center"
                style={{ color: "var(--brown-mid)" }}
              >
                Upgrade to Lullo Plus to save stories.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
