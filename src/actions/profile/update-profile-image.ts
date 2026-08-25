"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadAvatar, uploadBanner, deleteFromR2 } from "@/lib/r2/upload";
import { safeImageExtension, validateImageFile } from "@/lib/validations/files";
import { revalidatePath } from "next/cache";

type ProfileImageKind = "avatar" | "banner";

type UpdateProfileImageResult = {
  error: Error | null;
  path: string | null;
};

export async function updateProfileImage(
  kind: ProfileImageKind,
  file: File,
): Promise<UpdateProfileImageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: new Error("Not authenticated"), path: null };

  const { error: validationError } = validateImageFile(file);
  if (validationError) return { error: validationError, path: null };

  const isAvatar = kind === "avatar";
  const bucket = isAvatar ? "avatars" : "banners";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url, banner_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return {
      error: profileError ?? new Error("Profile not found"),
      path: null,
    };
  }

  const oldPath = isAvatar ? profile.avatar_url : profile.banner_url;
  const newPath = `${user.id}/${randomUUID()}.${safeImageExtension(file)}`;

  try {
    await (isAvatar ? uploadAvatar : uploadBanner)(file, newPath);
  } catch (error) {
    return { error: error as Error, path: null };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(isAvatar ? { avatar_url: newPath } : { banner_url: newPath })
    .eq("id", user.id);

  if (updateError) {
    try {
      await deleteFromR2(bucket, newPath);
    } catch {
      console.error(`Orphaned ${kind} after failed DB update:`, newPath);
    }

    return { error: new Error(updateError.message), path: null };
  }

  if (oldPath) {
    try {
      await deleteFromR2(bucket, oldPath);
    } catch {
      console.error(`Failed to delete old ${kind}:`, oldPath);
    }
  }

  revalidatePath("/profile/[nickname]", "page");

  return { error: null, path: newPath };
}
