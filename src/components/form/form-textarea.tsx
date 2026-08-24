import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type FormTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  maxWords?: number;
} & React.ComponentProps<typeof Textarea>;

const FormTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  maxWords,
  ...props
}: FormTextareaProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const wordCount = (field.value ?? "")
          .trim()
          .split(/\s+/)
          .filter(Boolean).length;

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Textarea
              {...field}
              {...props}
              value={field.value ?? ""}
              id={field.name}
              aria-invalid={fieldState.invalid}
            />
            {maxWords && (
              <p className="text-xs text-muted-foreground text-right">
                {wordCount}/{maxWords} words
              </p>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default FormTextarea;
