import { z } from "zod";
import {
  ACCEPTED_IMAGE,
  GENRES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "@/lib/constants";

const IMAGE_FORMATS_LABEL = Object.values(ACCEPTED_IMAGE)
  .flat()
  .map((ext) => ext.slice(1).toUpperCase())
  .join(", ");
import { MAX_TAGS, MAX_TAG_LENGTH, parseTags } from "@/lib/validations/song";

const stemCategories = [
  "vocals",
  "drums",
  "bass",
  "melody",
  "guitar",
  "synth",
  "fx",
  "other",
] as const;

export const uploadSchema = z.object({
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
  audio: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Audio file required")
    .refine((f) => f.type.startsWith("audio/"), "File must be an audio file"),
  cover: z
    .instanceof(File)
    .refine(
      (f) => f.type in ACCEPTED_IMAGE,
      `Cover must be ${IMAGE_FORMATS_LABEL}`,
    )
    .refine(
      (f) => f.size <= MAX_IMAGE_SIZE_BYTES,
      `Cover must be at most ${MAX_IMAGE_SIZE_MB}MB`,
    )
    .optional(),
  stems: z
    .array(
      z.object({
        file: z
          .instanceof(File)
          .refine((f) => f.size > 0, "Stem file required")
          .refine(
            (f) => f.type.startsWith("audio/"),
            "Stem must be an audio file",
          ),
        category: z.enum(stemCategories),
      }),
    )
    .max(10, "Maximum 10 stems per song")
    .optional(),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;
