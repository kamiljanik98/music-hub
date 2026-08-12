import {
  ACCEPTED_IMAGE,
  type AcceptedImageMimeType,
  MAX_IMAGE_SIZE_BYTES,
} from "../constants";

type ValidationResult = {
  error: Error | null;
  code?: "FORMAT" | "SIZE";
};

function isAcceptedImageMime(type: string): type is AcceptedImageMimeType {
  return type in ACCEPTED_IMAGE;
}

export const validateImageFile = (file: File): ValidationResult => {
  const fileType = file.type;

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { error: new Error("Image size exceeds the limit"), code: "SIZE" };
  }

  if (!isAcceptedImageMime(fileType)) {
    return { error: new Error("Invalid image format"), code: "FORMAT" };
  }

  return { error: null };
};

export const safeImageExtension = (file: File) => {
  const mime = file.type;
  if (!isAcceptedImageMime(mime)) return "bin";
  return ACCEPTED_IMAGE[mime][0].slice(1);
};
