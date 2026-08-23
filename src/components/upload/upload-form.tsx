"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useUpload from "@/hooks/upload/use-upload";
import { uploadSchema, type UploadFormValues } from "@/lib/validations/upload";
import { UploadHeader } from "@/components/upload/upload-header";
import { UploadFooter } from "@/components/upload/upload-footer";
import { AudioStep } from "@/components/upload/steps/audio-step";
import { DetailsStep } from "@/components/upload/steps/details-step";

type UploadFormProps = {
  step: 1 | 2;
  onStepChange: (step: 1 | 2) => void;
};

export default function UploadForm({ step, onStepChange }: UploadFormProps) {
  const { upload, isLoading } = useUpload();
  const router = useRouter();

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

  const audio = useWatch({ control: form.control, name: "audio" });

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
      return;
    }

    toast.success("Track uploaded successfully");
    router.push(`/upload/success/${data!.id}`);
  }

  return (
    <>
      <UploadHeader
        step={step}
        fileName={audio?.name ?? ""}
        onAudioReplace={onAudioReplace}
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col justify-center gap-4"
      >
        {step === 1 && (
          <AudioStep control={form.control} onFileDrop={onAudioDrop} />
        )}

        {step === 2 && <DetailsStep control={form.control} />}
      </form>

      {step === 2 && (
        <UploadFooter
          isLoading={isLoading}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      )}
    </>
  );
}
