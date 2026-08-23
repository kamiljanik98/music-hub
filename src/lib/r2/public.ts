import { IMAGE_PLACEHOLDER } from "../constants";
import { R2_AVATARS_URL, R2_BANNERS_URL, R2_COVERS_URL } from "./client";

export function getCoverUrl(path: string | null): string {
  if (!path) {
    return IMAGE_PLACEHOLDER.COVER;
  }
  return `${R2_COVERS_URL}/${path}`;
}

export function getAvatarUrl(path: string | null): string {
  if (!path) {
    return IMAGE_PLACEHOLDER.AVATAR;
  }
  return `${R2_AVATARS_URL}/${path}`;
}

export function getBannerUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }
  return `${R2_BANNERS_URL}/${path}`;
}
