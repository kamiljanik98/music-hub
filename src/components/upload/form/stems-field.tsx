"use client";

import { Control, useFieldArray } from "react-hook-form";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StemRow } from "@/components/upload/form/stem-row";
import type { UploadFormValues } from "@/lib/validations/upload";

type StemsFieldProps = {
  control: Control<UploadFormValues>;
};

export const StemsField = ({ control }: StemsFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stems",
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Stems (optional)</p>

        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() =>
            append({ file: undefined as never, category: "other" })
          }
        >
          <PlusIcon />
          Add stem
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {fields.map((field, index) => (
          <StemRow
            key={field.id}
            control={control}
            index={index}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
};
