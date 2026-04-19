"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Theme, themes } from "@/lib/themes";
import { StoryFormData } from "@/types/story";
import AudioPlayer from "@/components/story/audio-player";
import { createClient } from "@/lib/supabase/client";

const FREE_TIER_ALLOWANCE = 3;

export default function GeneratePage() {
  const [childName, setChildName] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [feeling, setFeeling] = useState<string>("");
  const [narrator, setNarrator] = useState<string>("");
  const [storyText, setStoryText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [generationsUsed, setGenerationsUsed] = useState<number>(0);
  const [plan, setPlan] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function getUserProfile() {
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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("generations_used, plan")
          .eq("id", user.id)
          .single();

        if (profileError) {
          throw profileError;
        }
        setPlan(profile.plan);
        setGenerationsUsed(profile.generations_used);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
        console.error(error);
      }
    }
    getUserProfile();
  }, []);

  function toggleTheme(t: Theme): void {
    setSelectedThemes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t],
    );
  }

  async function generateStory(e: React.SubmitEvent) {
    e.preventDefault();
    //warn paid user before generating a new story if the current one isn't saved
    if (audioUrl && !isSaved) {
      const confirmed = window.confirm(
        "You have an unsaved story. Generating a new one will lose it. Continue?",
      );
      if (!confirmed) return;
    }
    setGenerationsUsed((prev) => prev + 1);
    setAudioUrl("");
    setAudioBlob(null);
    setStoryText("");
    setIsSaved(false);
    setError("");
    setIsLoading(true);

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
      setStoryText(data.storyText);

      //posting to elevenlabs
      const audioResponse = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyText: data.storyText, narrator }),
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
      formData.append("storyText", storyText);
      formData.append("ageRange", ageRange);
      formData.append("selectedThemes", JSON.stringify(selectedThemes));
      formData.append("feeling", feeling);
      formData.append("narrator", narrator);

      const response = await fetch("/api/save-story", {
        method: "POST",
        body: formData, // Do NOT set 'Content-Type' header; fetch sets it automatically for FormData
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
  return (
    <div>
      <h1>Generate Your Story</h1>
      {plan === "free" &&
        (generationsUsed >= FREE_TIER_ALLOWANCE ? (
          <p>You have no free stories left this month.</p>
        ) : (
          <p>
            {FREE_TIER_ALLOWANCE - generationsUsed} free stories remaining this
            month.
          </p>
        ))}
      <form onSubmit={generateStory}>
        <Label>Child&apos;s Name</Label>
        <Input
          placeholder="Enter child's name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
        <Label>Age Range</Label>
        <Select value={ageRange} onValueChange={setAgeRange}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select an age range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Age</SelectLabel>
              <SelectItem value="5">Under 5</SelectItem>
              <SelectItem value="6">Under 8</SelectItem>
              <SelectItem value="7">Under 12</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Label>Theme</Label>
        {themes.map((theme) => (
          <span
            key={theme}
            onClick={() => toggleTheme(theme)}
            className={`px-3 py-1 rounded-full border text-sm cursor-pointer transition-colors ${
              selectedThemes.includes(theme)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {theme}
          </span>
        ))}
        <Label>Feeling</Label>
        <Input
          placeholder="e.g. nervous about school (optional)"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <Select value={narrator} onValueChange={setNarrator}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a narrator" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Narrator</SelectLabel>
              <SelectItem value="warm">Warn and Calm</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="gentle">Gentle British</SelectItem>
              <SelectItem value="cute">Cute</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </form>
      {storyText && <p>{storyText}</p>}
      {error && <p>{error}</p>}
      {audioUrl && (
        <div>
          <AudioPlayer src={audioUrl} />
          {plan === "plus" &&
            (isSaved ? (
              <p>Story saved!</p>
            ) : (
              <Button onClick={handleSaveStory} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            ))}
          {plan === "free" && <p>Upgrade to Lullo Plus to save stories.</p>}
        </div>
      )}
    </div>
  );
}
