"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadAvatar, uploadBanner, deleteFromR2 } from "@/lib/r2/upload";
import { safeImageExtension, validateImageFile } from "@/lib/validations/files";
import { revalidatePath } from "next/cache";
import type { SocialLinks } from "@/lib/validations/profile";

type UpdateProfileInput = {
  nickname: string;
  bio: string;
  avatarFile?: File;
  bannerFile?: File;
  socialLinks?: SocialLinks;
};

const toStoredLinks = (links?: SocialLinks) => {
  if (!links) return null;

  const entries = Object.entries(links).filter(([, url]) => url?.trim());

  return entries.length
    ? Object.fromEntries(entries.map(([key, url]) => [key, url!.trim()]))
    : null;
};

export async function updateProfile(input: UpdateProfileInput): Promise<{
  error: Error | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: new Error("Not authenticated"),
      avatarUrl: null,
      bannerUrl: null,
    };
  }

  const lowerNickname = input.nickname.toLowerCase();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", lowerNickname)
    .neq("id", user.id)
    .maybeSingle();

  if (existing) {
    return {
      error: new Error("Nickname already taken"),
      avatarUrl: null,
      bannerUrl: null,
    };
  }

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("avatar_url, banner_url")
    .eq("id", user.id)
    .single();

  if (fetchError || !profile) {
    return {
      error: new Error("Profile not found"),
      avatarUrl: null,
      bannerUrl: null,
    };
  }

  const oldAvatarPath = profile.avatar_url;
  const oldBannerPath = profile.banner_url;
  let newAvatarPath: string | null = null;
  let newBannerPath: string | null = null;

  if (input.avatarFile) {
    const { error } = validateImageFile(input.avatarFile);
    if (error) {
      return { error, avatarUrl: null, bannerUrl: null };
    }

    const extension = safeImageExtension(input.avatarFile);
    newAvatarPath = `${user.id}/${randomUUID()}.${extension}`;

    try {
      await uploadAvatar(input.avatarFile, newAvatarPath);
    } catch (error) {
      return { error: error as Error, avatarUrl: null, bannerUrl: null };
    }
  }

  if (input.bannerFile) {
    const { error } = validateImageFile(input.bannerFile);
    if (error) {
      return { error, avatarUrl: null, bannerUrl: null };
    }

    const extension = safeImageExtension(input.bannerFile);
    newBannerPath = `${user.id}/${randomUUID()}.${extension}`;

    try {
      await uploadBanner(input.bannerFile, newBannerPath);
    } catch (error) {
      return { error: error as Error, avatarUrl: null, bannerUrl: null };
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      nickname: lowerNickname,
      bio: input.bio || null,
      social_links: toStoredLinks(input.socialLinks),
      ...(newAvatarPath ? { avatar_url: newAvatarPath } : {}),
      ...(newBannerPath ? { banner_url: newBannerPath } : {}),
    })
    .eq("id", user.id);

  if (updateError) {
    if (newAvatarPath) {
      try {
        await deleteFromR2("avatars", newAvatarPath);
      } catch {
        console.error("Orphaned avatar after failed DB update:", newAvatarPath);
      }
    }

    if (newBannerPath) {
      try {
        await deleteFromR2("banners", newBannerPath);
      } catch {
        console.error("Orphaned banner after failed DB update:", newBannerPath);
      }
    }

    return { error: updateError, avatarUrl: null, bannerUrl: null };
  }

  if (newAvatarPath && oldAvatarPath) {
    try {
      await deleteFromR2("avatars", oldAvatarPath);
    } catch {
      console.error(
        "Orphaned old avatar after successful update:",
        oldAvatarPath,
      );
    }
  }

  if (newBannerPath && oldBannerPath) {
    try {
      await deleteFromR2("banners", oldBannerPath);
    } catch {
      console.error(
        "Orphaned old banner after successful update:",
        oldBannerPath,
      );
    }
  }

  revalidatePath("/profile/[nickname]", "page");
  revalidatePath("/songs/[id]", "page");
  revalidatePath("/feed");
  revalidatePath("/profile/[nickname]/following", "page");
  revalidatePath("/profile/[nickname]/followers", "page");

  return { error: null, avatarUrl: newAvatarPath, bannerUrl: newBannerPath };
}
