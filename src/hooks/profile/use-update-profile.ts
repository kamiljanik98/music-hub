"use client";

import { useState } from "react";
import useUser from "@/hooks/profile/use-user";
import { updateProfile } from "@/actions/profile/update-profile";
import type { SocialLinks } from "@/lib/validations/profile";

type UpdateProfileInput = {
  nickname: string;
  bio: string;
  avatarFile?: File;
  bannerFile?: File;
  socialLinks?: SocialLinks;
};

export default function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  async function update(
    input: UpdateProfileInput,
  ): Promise<{ error: Error | null }> {
    setIsLoading(true);
    const { error, avatarUrl, bannerUrl } = await updateProfile(input);
    setIsLoading(false);

    if (!error && user) {
      setUser({
        ...user,
        nickname: input.nickname.toLowerCase(),
        bio: input.bio || null,
        social_links: input.socialLinks ?? null,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        ...(bannerUrl ? { banner_url: bannerUrl } : {}),
      });
    }

    return { error };
  }

  return { update, isLoading };
}
