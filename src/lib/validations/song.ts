import { z } from "zod";
import { GENRES } from "@/lib/constants";

export const MAX_TAGS = 8;
export const MAX_TAG_LENGTH = 24;

export const parseTags = (input?: string): string[] => {
  if (!input) return [];

  const tags = input
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(tags)];
};

export const songSchema = z.object({
  title: z.string().min(1, "Title is required"),
  bpm: z
    .string()
    .optional()
    .refine(
      (v) => !v || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 999),
      "BPM must be a number between 1 and 999",
    ),
  scale: z.string().optional(),
  genre: z.enum(GENRES).optional().or(z.literal("")),
  tags: z
    .string()
    .optional()
    .refine(
      (v) => parseTags(v).length <= MAX_TAGS,
      `At most ${MAX_TAGS} tags allowed`,
    )
    .refine(
      (v) => parseTags(v).every((tag) => tag.length <= MAX_TAG_LENGTH),
      `Each tag must be at most ${MAX_TAG_LENGTH} characters`,
    ),
  description: z.string().optional(),
});

export type SongFormValues = z.infer<typeof songSchema>;
