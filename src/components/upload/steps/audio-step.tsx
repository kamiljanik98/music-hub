"use client";

import { Control } from "react-hook-form";
import FormInputFileAudio from "@/components/upload/form/form-input-file-audio";
import { ACCEPTED_AUDIO, MAX_AUDIO_SIZE_MB } from "@/lib/constants";
import type { UploadFormValues } from "@/lib/validations/upload";

const audioFormatsLabel = Object.values(ACCEPTED_AUDIO)
  .flat()
  .map((ext) => ext.slice(1).toUpperCase())
  .join(", ");

type AudioStepProps = {
  control: Control<UploadFormValues>;
  onFileDrop: (file: File) => void;
};

export const AudioStep = ({ control, onFileDrop }: AudioStepProps) => {
  return (
    <div className="w-full">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">Upload your audio files.</h1>

        <p className="text-xs text-muted-foreground">
          Accepted formats: {audioFormatsLabel}. Max file size{" "}
          {MAX_AUDIO_SIZE_MB}MB.
        </p>
      </div>

      <FormInputFileAudio
        name="audio"
        control={control}
        label="Audio file"
        accept={ACCEPTED_AUDIO}
        onFileDrop={onFileDrop}
        className="h-64 min-h-0 w-full rounded-[var(--radius-lg)]"
      />
    </div>
  );
};
