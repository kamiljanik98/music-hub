"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/form-input";
import FormTextarea from "@/components/form/form-textarea";
import useUpdateProfile from "@/hooks/profile/use-update-profile";
import { authErrorMessage } from "@/lib/auth-error-message";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validations/profile";
import useUser from "@/hooks/profile/use-user";
import type { SocialLinks } from "@/lib/validations/profile";

export function EditProfileDialog() {
  const [open, setOpen] = useState(false);
  const user = useUser((state) => state.user);
  const { update, isLoading } = useUpdateProfile();

  const storedLinks = (user?.social_links ?? null) as SocialLinks | null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: user?.nickname ?? "",
      bio: user?.bio ?? "",
      avatar: undefined,
      banner: undefined,
      socialLinks: {
        youtube: storedLinks?.youtube ?? "",
        instagram: storedLinks?.instagram ?? "",
        tiktok: storedLinks?.tiktok ?? "",
        spotify: storedLinks?.spotify ?? "",
        soundcloud: storedLinks?.soundcloud ?? "",
      },
    },
    mode: "onBlur",
  });

  async function onSubmit(values: ProfileFormValues) {
    const { error } = await update({
      nickname: values.nickname,
      bio: values.bio ?? "",
      avatarFile: values.avatar,
      bannerFile: values.banner,
      socialLinks: values.socialLinks,
    });

    if (error) {
      toast.error(authErrorMessage(error));
    } else {
      toast.success("Profile updated");
      setOpen(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next && user) {
          form.reset({
            nickname: user.nickname ?? "",
            bio: user.bio ?? "",
            avatar: undefined,
            banner: undefined,
            socialLinks: {
              youtube: storedLinks?.youtube ?? "",
              instagram: storedLinks?.instagram ?? "",
              tiktok: storedLinks?.tiktok ?? "",
              spotify: storedLinks?.spotify ?? "",
              soundcloud: storedLinks?.soundcloud ?? "",
            },
          });
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput
            name="nickname"
            control={form.control}
            label="Nickname"
            placeholder="Nickname"
          />
          <FormTextarea
            name="bio"
            control={form.control}
            label="Bio"
            placeholder="Tell people about yourself"
            maxWords={150}
            rows={4}
          />
          <FormInput
            name="socialLinks.youtube"
            control={form.control}
            label="YouTube"
            placeholder="https://youtube.com/@you"
          />
          <FormInput
            name="socialLinks.instagram"
            control={form.control}
            label="Instagram"
            placeholder="https://instagram.com/you"
          />
          <FormInput
            name="socialLinks.tiktok"
            control={form.control}
            label="TikTok"
            placeholder="https://tiktok.com/@you"
          />
          <FormInput
            name="socialLinks.spotify"
            control={form.control}
            label="Spotify"
            placeholder="https://open.spotify.com/artist/..."
          />
          <FormInput
            name="socialLinks.soundcloud"
            control={form.control}
            label="SoundCloud"
            placeholder="https://soundcloud.com/you"
          />
          <Button variant="secondary" type="submit" loading={isLoading}>
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
