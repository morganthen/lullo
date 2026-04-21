import { StoryFormData } from "@/types/story";

const ageInstructions: Record<string, string> = {
  "5": "Use very short sentences and simple words only. Max 300 words.",
  "8": "Use simple sentences with a small problem and resolution. Max 450 words.",
  "12": "Use richer language with two characters and a developed arc. Max 600 words.",
};

export function generateStoryPrompt(formData: StoryFormData): string {
  const { childName, ageRange, selectedThemes, feeling, narrator } = formData;

  const toneMap: Record<string, string> = {
    warm: "warm and calm",
    playful: "light and playful",
    gentle: "gentle and measured",
    cute: "soft and soothing",
  };

  const tone = toneMap[narrator] ?? "warm and calm";
  const themes = selectedThemes.join(" and ");
  const ageGuide = ageInstructions[ageRange] ?? ageInstructions["5"];
  const feelingLine = feeling
    ? `The story should gently explore the feeling of ${feeling}.`
    : "";

  return `You are a ${tone} bedtime story narrator.

Write a bedtime story for a child named ${childName}.
Theme: ${themes}.
${feelingLine}
${ageGuide}
Use a ${tone} tone throughout.
End with ${childName} feeling safe, sleepy, and at peace.
Never excite the child. The story arc must wind down toward sleep.

Writing style requirements:
- Use short sentences. Prefer 8 to 12 words per sentence.
- Use ellipses (...) frequently to create natural pauses and gentle pacing.
- If you have to repeat words, don't use commas INSTEAD separate them using ellipses (...) for better pacing.
- Use commas generously to slow the rhythm.
- Use soft, drowsy language. Slow verbs. Gentle adjectives.
- Avoid complex sentences that run on without breath.
- Each paragraph should feel like a slow exhale.

Output plain text only. No markdown, no headers, no asterisks, no hashtags, no special characters.

Return the result using the output_story tool with a title, description, and story.`;
}
