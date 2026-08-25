import { z } from "zod";

export const playlistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(80, "Title must be at most 80 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean(),
});

export type PlaylistFormValues = z.infer<typeof playlistSchema>;
