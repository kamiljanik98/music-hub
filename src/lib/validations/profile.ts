import { z } from "zod";
import {
  ACCEPTED_IMAGE,
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
} from "@/lib/constants";

const IMAGE_FORMATS_LABEL = Object.values(ACCEPTED_IMAGE)
  .flat()
  .map((ext) => ext.slice(1).toUpperCase())
  .join(", ");

const imageFile = z
  .instanceof(File)
  .refine(
    (file) => file.type in ACCEPTED_IMAGE,
    `Image must be ${IMAGE_FORMATS_LABEL}`,
  )
  .refine(
    (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    `Image must be at most ${MAX_IMAGE_SIZE_MB}MB`,
  );

const bioSchema = z
  .string()
  .refine(
    (value) => value.trim().split(/\s+/).filter(Boolean).length <= 150,
    "Bio must be at most 150 words",
  );

export const nicknameSchema = z
  .string()
  .min(3, "Nickname must be at least 3 characters")
  .max(32, "Nickname must be at most 32 characters")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, and _.- allowed");

const socialUrl = z.url("Must be a valid URL").or(z.literal("")).optional();

const socialLinksSchema = z.object({
  youtube: socialUrl,
  instagram: socialUrl,
  tiktok: socialUrl,
  spotify: socialUrl,
  soundcloud: socialUrl,
});

export type SocialLinks = z.infer<typeof socialLinksSchema>;

export const profileSchema = z.object({
  nickname: nicknameSchema,
  bio: bioSchema.optional().or(z.literal("")),
  avatar: imageFile.optional(),
  banner: imageFile.optional(),
  socialLinks: socialLinksSchema.optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
