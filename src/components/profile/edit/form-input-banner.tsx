"use client";

import { useEffect, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ACCEPTED_IMAGE } from "@/lib/constants";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { getBannerUrl } from "@/lib/r2/public";

type FormInputBannerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  currentBannerPath: string | null;
};

const FormInputBanner = <T extends FieldValues>({
  name,
  control,
  currentBannerPath,
}: FormInputBannerProps<T>) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const current = preview ?? getBannerUrl(currentBannerPath);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Banner</FieldLabel>

          <div className="flex flex-col gap-3">
            <div className="aspect-[4/1] w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-[linear-gradient(120deg,rgba(168,85,247,0.35),rgba(214,242,75,0.22))]">
              {current && (
                <img
                  src={current}
                  alt="Banner preview"
                  className="size-full object-cover"
                />
              )}
            </div>

            <input
              type="file"
              accept={Object.keys(ACCEPTED_IMAGE).join(",")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                field.onChange(file);
                setPreview(URL.createObjectURL(file));
              }}
              className="text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:text-foreground"
            />
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormInputBanner;
