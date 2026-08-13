"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { uploadAvatar, deleteFromR2 } from "@/lib/r2/upload";
import { safeImageExtension, validateImageFile } from "@/lib/validations/files";
import { revalidatePath } from "next/cache";

type UpdateProfileInput = {
  nickname: string;
  bio: string;
  avatarFile?: File;
};

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<{ error: Error | null; avatarUrl: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: new Error("Not authenticated"), avatarUrl: null };
  }

  const lowerNickname = input.nickname.toLowerCase();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", lowerNickname)
    .neq("id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: new Error("Nickname already taken"), avatarUrl: null };
  }

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  if (fetchError || !profile) {
    return { error: new Error("Profile not found"), avatarUrl: null };
  }

  const oldAvatarPath = profile.avatar_url;
  let newAvatarPath: string | null = null;

  if (input.avatarFile) {
    const { error } = validateImageFile(input.avatarFile);
    if (error) {
      return { error, avatarUrl: null };
    }

    const extension = safeImageExtension(input.avatarFile);
    newAvatarPath = `${user.id}/${randomUUID()}.${extension}`;

    try {
      await uploadAvatar(input.avatarFile, newAvatarPath);
    } catch (error) {
      return { error: error as Error, avatarUrl: null };
    }
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      nickname: lowerNickname,
      bio: input.bio || null,
      ...(newAvatarPath ? { avatar_url: newAvatarPath } : {}),
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
    return { error: updateError, avatarUrl: null };
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

  revalidatePath("/profile/[nickname]", "page");
  revalidatePath("/songs/[id]", "page");
  revalidatePath("/feed");
  revalidatePath("/profile/[nickname]/following", "page");
  revalidatePath("/profile/[nickname]/followers", "page");

  return { error: null, avatarUrl: newAvatarPath };
}
