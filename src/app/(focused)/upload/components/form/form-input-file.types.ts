import { type Accept } from "react-dropzone";
import {
  type Control,
  type Path,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";

export type FormInputFileProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  onFileDrop?: (file: File) => void;
  accept?: Accept;
  maxSize?: number;
  className?: string;
};

export type DropzoneFieldProps<T extends FieldValues> = Omit<
  FormInputFileProps<T>,
  "name" | "control"
> & {
  field: ControllerRenderProps<T>;
  fieldState: ControllerFieldState;
};
