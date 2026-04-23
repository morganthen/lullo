import { expect, test, describe } from "vitest";
import { generateStoryPrompt } from "./generateStoryPrompt";
import { StoryFormData } from "@/types/story";

const baseFormData: StoryFormData = {
  childName: "Mia",
  ageRange: "5",
  selectedThemes: ["magic", "dinosaur"],
  feeling: "Nervous about school",
  narrator: "warm",
};

describe("generateStoryPrompt", () => {
  test("uses the warm tone when narrator is warm", () => {
    expect(generateStoryPrompt(baseFormData)).toContain("warm and calm");
  });

  test("uses the light and playful tone when narrator is playful", () => {
    const formData = { ...baseFormData, narrator: "playful" };

    expect(generateStoryPrompt(formData)).toContain("light and playful");
  });

  test("uses the warm and calm tone when narrator is gibberish", () => {
    const formData = { ...baseFormData, narrator: "gibberish" };
    expect(generateStoryPrompt(formData)).toContain("warm and calm");
  });

  test("falls back to the age-5 instructions when ageRange is unknown", () => {
    const formData = { ...baseFormData, ageRange: "" };
    expect(generateStoryPrompt(formData)).toContain(
      "Use very short sentences and simple words only. Max 300 words.",
    );
  });

  test("omits feeling line when feeling is empty", () => {
    const formData = { ...baseFormData, feeling: "" };
    expect(generateStoryPrompt(formData)).not.toContain(
      "gently explore the feeling",
    );
  });
});
