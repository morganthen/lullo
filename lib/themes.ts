export const themes: string[] = [
  "space",
  "ocean",
  "animals",
  "magic",
  "dinosaurs",
  "forest",
  "robots",
  "family",
  "friendship",
  "fruits",
] as const;

export type Theme = (typeof themes)[number];
