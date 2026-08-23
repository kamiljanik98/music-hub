"use client";

import { Control } from "react-hook-form";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormInputFileImage from "@/components/upload/form/form-input-file-image";
import { StemsField } from "@/components/upload/form/stems-field";
import { ACCEPTED_IMAGE, GENRES } from "@/lib/constants";
import type { UploadFormValues } from "@/lib/validations/upload";

type DetailsStepProps = {
  control: Control<UploadFormValues>;
};

export const DetailsStep = ({ control }: DetailsStepProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex justify-center">
        <div className="w-72">
          <FormInputFileImage
            name="cover"
            control={control}
            label="Cover image"
            accept={ACCEPTED_IMAGE}
            className="rounded-[var(--radius-md)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FormInput
          name="title"
          control={control}
          label="Track title*"
          placeholder="Track title"
        />

        <FormInput
          name="bpm"
          control={control}
          label="BPM"
          placeholder="140"
          type="number"
        />

        <FormInput
          name="scale"
          control={control}
          label="Scale"
          placeholder="A minor"
        />

        <FormSelect
          name="genre"
          control={control}
          label="Genre"
          options={GENRES}
          placeholder="Pick a genre"
        />

        <FormInput
          name="tags"
          control={control}
          label="Tags"
          placeholder="Add styles, moods."
        />

        <FormInput
          name="description"
          control={control}
          label="Description"
          placeholder="Tracks with descriptions tend to get more plays and engagements."
        />
      </div>

      <StemsField control={control} />
    </div>
  );
};
