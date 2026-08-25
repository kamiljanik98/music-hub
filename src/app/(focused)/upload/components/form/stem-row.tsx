"use client";

import { Control, Controller } from "react-hook-form";
import { TrashIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";
import FormInputFileStem from "./form-input-file-stem";
import { ACCEPTED_AUDIO } from "@/lib/constants";
import type { UploadFormValues } from "@/lib/validations/upload";

const STEM_CATEGORIES = [
  "vocals",
  "drums",
  "bass",
  "melody",
  "guitar",
  "synth",
  "fx",
  "other",
] as const;

type StemRowProps = {
  control: Control<UploadFormValues>;
  index: number;
  onRemove: () => void;
};

export const StemRow = ({ control, index, onRemove }: StemRowProps) => {
  return (
    <div className="flex items-center gap-3">
      <FormInputFileStem
        name={`stems.${index}.file`}
        control={control}
        label=""
        accept={ACCEPTED_AUDIO}
        className="flex-1"
      />

      <Controller
        name={`stems.${index}.category`}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STEM_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove stem ${index + 1}`}
        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
      >
        <TrashIcon size={16} />
      </button>
    </div>
  );
};
