"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { Camera, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateProfileImage } from "@/actions/profile/update-profile-image";
import { validateImageFile } from "@/lib/validations/files";

type EditableBannerProps = {
  bannerUrl: string | null;
  nickname: string;
};

export function EditableBanner({ bannerUrl, nickname }: EditableBannerProps) {
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
      const { error } = await updateProfileImage("banner", file);

      URL.revokeObjectURL(objectUrl);
      setPreview(null);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Banner updated");
    });
  };

  const src = preview ?? bannerUrl;

  return (
    <div className="group/banner absolute inset-0">
      {src && (
        <Image
          src={src}
          alt={`${nickname} banner`}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          unoptimized={Boolean(preview)}
        />
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isSaving}
        aria-label="Change banner"
        className="absolute bottom-4 left-6 z-10 flex items-center gap-2 rounded-[var(--mh-radius-pill)] bg-black/55 px-4 py-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover/banner:opacity-100 focus-visible:opacity-100 disabled:opacity-100"
      >
        {isSaving ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <>
            <Camera className="size-4" />
            Edit banner
          </>
        )}
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
