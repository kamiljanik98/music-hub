import type { Accept } from "react-dropzone";

export const ACCEPTED_AUDIO = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/flac": [".flac"],
  "audio/ogg": [".ogg"],
} as const satisfies Accept;

export type AcceptedAudioMimeType = keyof typeof ACCEPTED_AUDIO;

export const MAX_AUDIO_SIZE_MB = 200;
export const MAX_AUDIO_SIZE_BYTES = MAX_AUDIO_SIZE_MB * 1024 * 1024;

export const ACCEPTED_IMAGE = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
} as const satisfies Accept;

export type AcceptedImageMimeType = keyof typeof ACCEPTED_IMAGE;

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const DASHED_BORDER = {
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23ffffff4d' stroke-width='2' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
} as const;

export const IMAGE_PLACEHOLDER = {
  COVER: "/placeholders/cover-placeholder.jpg",
  AVATAR: "/placeholders/avatar-placeholder.jpg",
} as const;

export const GENRES = [
  "Hip Hop",
  "Trap",
  "R&B",
  "Pop",
  "Rock",
  "Metal",
  "Electronic",
  "House",
  "Techno",
  "Drum & Bass",
  "Lo-fi",
  "Ambient",
  "Jazz",
  "Classical",
  "Experimental",
  "Other",
] as const;

export type Genre = (typeof GENRES)[number];
