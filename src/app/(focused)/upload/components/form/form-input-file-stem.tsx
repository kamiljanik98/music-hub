"use client";

import { Controller, FieldValues } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FormInputFileProps } from "./form-input-file.types";
import { cn } from "@/lib/utils";

const FormInputFileStem = <T extends FieldValues>({
  name,
  control,
  label,
  accept,
  className,
}: FormInputFileProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const file = field.value as File | undefined;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel>{label}</FieldLabel>}
            <div className={cn("flex items-center gap-2 min-w-0", className)}>
              <input
                type="file"
                accept={accept ? Object.keys(accept).join(",") : undefined}
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) field.onChange(selected);
                }}
                aria-invalid={fieldState.invalid}
                className="flex-1 text-xs text-neutral-400 file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs file:text-foreground"
              />
              {file && (
                <button
                  type="button"
                  onClick={() => field.onChange(undefined)}
                  className="shrink-0 text-neutral-500 hover:text-destructive transition-colors"
                >
                  <XIcon size={14} />
                </button>
              )}
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default FormInputFileStem;
