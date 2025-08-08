"use client";

import { useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "@/components/common/Modal";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import ControlledSelect from "@/components/common/ControlledSelect";
import { scale } from "@/constants/song-scale";
import { genre } from "@/constants/song-genre";

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      bpm: null,
      scale: "C",
      genre: "Pop",
      tags: "",
      song: undefined,
      image: undefined,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      uploadModal.onClose();
      setError(null);
      reset();
    }
  };

  const MAX_AUDIO_SIZE = 10 * 1024 * 1024;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setError(null);
    try {
      setIsLoading(true);

      if (!user) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile) {
        setError("Please select both an audio file and an image.");
        setIsLoading(false);
        return;
      }

      if (songFile.size > MAX_AUDIO_SIZE) {
        setError(`Audio file size must be less than ${MAX_AUDIO_SIZE / (1024 * 1024)} MB.`);
        setIsLoading(false);
        return;
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        setError(`Image file size must be less than ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`);
        setIsLoading(false);
        return;
      }

      const songFileName = values.title.trim();
      const imageFileName = values.title.trim();

      if (!songFileName) {
        setError("Title is required for the file names.");
        setIsLoading(false);
        return;
      }

      const { error: songError } = await supabaseClient.storage
        .from("audio")
        .upload(songFileName, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setError(`Song upload failed: ${songError.message}`);
        setIsLoading(false);
        return;
      }

      const { error: imageError } = await supabaseClient.storage
        .from("images")
        .upload(imageFileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        setError(`Image upload failed: ${imageError.message}`);
        setIsLoading(false);
        return;
      }

      const imageUrl = supabaseClient.storage.from("images").getPublicUrl(imageFileName)
        .data.publicUrl;

      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0)
        : [];

      const { error: dbError } = await supabaseClient.from("audio_files").insert({
        title: values.title.trim(),
        uploaded_by: user.id,
        path: songFileName,
        image_path: imageUrl,
        bpm: values.bpm ? Number(values.bpm) : null,
        scale: values.scale,
        genre: values.genre,
        tags: tagsArray,
      });

      if (dbError) {
        setError(`Database insert failed: ${dbError.message}`);
        setIsLoading(false);
        return;
      }

      reset();
      uploadModal.onClose();
      window.location.reload();
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: "Title is required" })}
          placeholder="Song title"
          aria-invalid={errors.title ? "true" : "false"}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>
        )}

        <Input
          id="bpm"
          type="number"
          disabled={isLoading}
          {...register("bpm", {
            min: { value: 1, message: "BPM must be at least 1" },
            valueAsNumber: true,
          })}
          placeholder="BPM"
          aria-invalid={errors.bpm ? "true" : "false"}
        />
        {errors.bpm && <p className="text-red-500 text-xs mt-1">{errors.bpm.message as string}</p>}

        <div>
          <div className="pb-2 text-sm">Select Scale and genre</div>
          <div className="flex gap-4">
            <ControlledSelect
              control={control}
              name="scale"
              options={scale}
              placeholder="Select scale"
              disabled={isLoading}
            />

            <ControlledSelect
              control={control}
              name="genre"
              options={genre}
              placeholder="Select genre"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="pb-2 text-sm">Tags, Keywords, Mood</div>
          <Input
            id="tags"
            disabled={isLoading}
            {...register("tags")}
            placeholder="Tags (comma separated)"
          />
        </div>

        <div>
          <div className="pb-2 text-sm">Select an audio file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: "Audio file is required" })}
            aria-invalid={errors.song ? "true" : "false"}
          />
          {errors.song && (
            <p className="text-red-500 text-xs mt-1">{errors.song.message as string}</p>
          )}
        </div>

        <div>
          <div className="pb-2 text-sm">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: "Image file is required" })}
            aria-invalid={errors.image ? "true" : "false"}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message as string}</p>
          )}
        </div>
        {error && (
          <div className="text-red-600 rounded-lg p-4 bg-red-900/50 text-sm mb-2">{error}</div>
        )}

        <Button disabled={isLoading} type="submit">
          {isLoading ? "Uploading..." : "Create"}
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
