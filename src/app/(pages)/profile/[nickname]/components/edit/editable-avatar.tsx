"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { updateProfileImage } from "@/actions/profile/update-profile-image";
import { validateImageFile } from "@/lib/validations/files";
import { getAvatarUrl } from "@/lib/r2/public";

type EditableAvatarProps = {
  avatarPath: string | null;
  nickname: string;
};

export function EditableAvatar({ avatarPath, nickname }: EditableAvatarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaving, startSave] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const { error: validationError } = validateImageFile(file);

    if (validationError) {
      toast.error(validationError.message);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startSave(async () => {
      const { error } = await updateProfileImage("avatar", file);

      URL.revokeObjectURL(objectUrl);
      setPreview(null);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Avatar updated");
    });
  };

  return (
    <div className="group/avatar relative size-32 shrink-0">
      <Image
        src={preview ?? getAvatarUrl(avatarPath)}
        alt={nickname}
        width={128}
        height={128}
        className="size-32 rounded-full object-cover ring-4 ring-[var(--mh-ink)]"
        unoptimized={Boolean(preview)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isSaving}
        aria-label="Change avatar"
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition-opacity group-hover/avatar:opacity-100 focus-visible:opacity-100 disabled:opacity-100"
      >
        <span className="flex flex-col items-center gap-1 text-xs font-medium text-white">
          <Camera className="size-5" />
          {isSaving ? "Saving..." : "Edit"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
