"use client";

import { useRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormInput from "@/components/form/form-input";
import FormInputFileAudio from "@/components/upload/form/form-input-file-audio";
import FormInputFileImage from "@/components/upload/form/form-input-file-image";
import FormInputFileStem from "@/components/upload/form/form-input-file-stem";
import useUpload from "@/hooks/upload/use-upload";
import { uploadSchema, type UploadFormValues } from "@/lib/validations/upload";
import { useRouter } from "next/navigation";
import { XIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldError } from "../ui/field";
import {
  ACCEPTED_AUDIO,
  MAX_AUDIO_SIZE_MB,
  ACCEPTED_IMAGE,
} from "@/lib/constants";

const audioFormatsLabel = Object.values(ACCEPTED_AUDIO)
  .flat()
  .map((ext) => ext.slice(1).toUpperCase())
  .join(", ");

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

type UploadFormProps = {
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
};

export default function UploadForm({ step, onStepChange }: UploadFormProps) {
  const { upload, isLoading } = useUpload();
  const router = useRouter();
  const audioInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      bpm: undefined,
      scale: "",
      genre: "",
      tags: "",
      description: "",
      stems: [],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stems",
  });

  function onAudioDrop(file: File) {
    const name = file.name.replace(/\.[^.]+$/, "");
    form.setValue("title", name, { shouldValidate: true });
    onStepChange(2);
  }

  function onAudioReplace(file: File) {
    form.setValue("audio", file as never, { shouldValidate: true });
    const name = file.name.replace(/\.[^.]+$/, "");
    form.setValue("title", name, { shouldValidate: true });
  }

  async function onSubmit(values: UploadFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.bpm) formData.append("bpm", values.bpm);
    if (values.scale) formData.append("scale", values.scale);
    if (values.genre) formData.append("genre", values.genre);
    if (values.tags?.trim()) formData.append("tags", values.tags);
    if (values.description?.trim())
      formData.append("description", values.description);
    formData.append("audio", values.audio);
    if (values.cover) formData.append("cover", values.cover);

    values.stems?.forEach((stem, index) => {
      formData.append(`stems[${index}].file`, stem.file);
      formData.append(`stems[${index}].category`, stem.category);
    });

    const { data, error } = await upload(formData);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Track uploaded successfully");
      router.push(`/upload/success/${data!.id}`);
    }
  }

  const fileName = form.watch("audio")?.name ?? "";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 border-b border-white/10 bg-background/50 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
          <span className="flex gap-2 items-center">
            <Image src="/logo.svg" alt="App logo" width={42} height={42} />
            {step === 1 ? (
              <p className="font-semibold text-sm text-foreground">Upload</p>
            ) : (
              <p className="font-semibold text-sm text-foreground">
                Track Info
              </p>
            )}
          </span>
          <div className="flex gap-3 items-center">
            {step === 2 && (
              <>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept={Object.keys(ACCEPTED_AUDIO).join(",")}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    onAudioReplace(file);
                  }}
                />
                {fileName && (
                  <p className="text-xs text-neutral-500 truncate max-w-xs">
                    {fileName}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Replace
                </button>
              </>
            )}
            <Link
              href="/"
              className="hover:bg-neutral-300 bg-neutral-200 rounded-full p-3 transition-colors"
            >
              <XIcon size={20} className="text-neutral-800" />
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {step === 1 && (
          <div>
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold">
                Upload your audio files.
              </h1>
              <p className="text-xs text-muted-foreground">
                Accepted formats: {audioFormatsLabel}. Max file size{" "}
                {MAX_AUDIO_SIZE_MB}MB.
              </p>
            </div>
            <FormInputFileAudio
              name="audio"
              control={form.control}
              label="Audio file"
              accept={ACCEPTED_AUDIO}
              onFileDrop={onAudioDrop}
              className="w-full rounded-md"
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-center">
              <div className="w-100">
                <FormInputFileImage
                  name="cover"
                  control={form.control}
                  label="Cover image"
                  accept={ACCEPTED_IMAGE}
                  className="rounded-md"
                />
              </div>
            </div>
            <FormInput
              name="title"
              control={form.control}
              label="Track title*"
              placeholder="Track title"
            />
            <FormInput
              name="bpm"
              control={form.control}
              label="BPM"
              placeholder="140"
              type="number"
            />
            <FormInput
              name="scale"
              control={form.control}
              label="Scale"
              placeholder="A minor"
            />
            <FormInput
              name="genre"
              control={form.control}
              label="Genre"
              placeholder="Add or search for genre"
            />
            <FormInput
              name="tags"
              control={form.control}
              label="Tags"
              placeholder="Add styles, moods."
            />
            <FormInput
              name="description"
              control={form.control}
              label="Description"
              placeholder="Tracks with descriptions tend to get more plays and engagements."
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Stems (optional)
                </p>
                <button
                  type="button"
                  onClick={() =>
                    append({ file: undefined as never, category: "other" })
                  }
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  <PlusIcon size={14} />
                  Add stem
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <FormInputFileStem
                    name={`stems.${index}.file`}
                    control={form.control}
                    label=""
                    accept={ACCEPTED_AUDIO}
                    className="flex-1"
                  />

                  <Controller
                    name={`stems.${index}.category`}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STEM_CATEGORIES.map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="text-xs"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="shrink-0 text-neutral-400 hover:text-destructive transition-colors"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {step === 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-background/50 backdrop-blur-md px-6 py-4">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <p className="text-xs text-neutral-500 max-w-sm">
              By uploading, you confirm that your sounds comply with our Terms
              of Use and you don&apos;t infringe anyone else&apos;s rights.
            </p>
            <Button
              type="button"
              disabled={isLoading}
              onClick={form.handleSubmit(onSubmit)}
              className="rounded-full text-xs bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-50 py-5 px-16"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
