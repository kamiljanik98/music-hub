"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormTextarea from "@/components/form/form-textarea";
import { updateSong } from "@/actions/songs/update-song";
import {
  parseTags,
  songSchema,
  type SongFormValues,
} from "@/lib/validations/song";
import { GENRES, type Genre } from "@/lib/constants";
import type { Song } from "@/types";

type EditSongDialogProps = {
  song: Song;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const toGenre = (genre: string | null): Genre | "" =>
  GENRES.includes(genre as Genre) ? (genre as Genre) : "";

const toFormValues = (song: Song): SongFormValues => ({
  title: song.title,
  bpm: song.bpm ? String(song.bpm) : "",
  scale: song.scale ?? "",
  genre: toGenre(song.genre),
  tags: song.tags?.join(", ") ?? "",
  description: song.description ?? "",
});

export function EditSongDialog({
  song,
  open,
  onOpenChange,
}: EditSongDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SongFormValues>({
    resolver: zodResolver(songSchema),
    defaultValues: toFormValues(song),
    mode: "onBlur",
  });

  const onSubmit = (values: SongFormValues) => {
    startTransition(async () => {
      const { error } = await updateSong(song.id, {
        title: values.title,
        bpm: values.bpm ? Number(values.bpm) : null,
        scale: values.scale?.trim() || null,
        genre: values.genre || null,
        tags: parseTags(values.tags).length ? parseTags(values.tags) : null,
        description: values.description?.trim() || null,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Track updated");
      onOpenChange(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) form.reset(toFormValues(song));
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit track</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput
            name="title"
            control={form.control}
            label="Title"
            placeholder="Track title"
          />
          <FormInput
            name="bpm"
            control={form.control}
            label="BPM"
            placeholder="120"
          />
          <FormInput
            name="scale"
            control={form.control}
            label="Scale"
            placeholder="A minor"
          />
          <FormSelect
            name="genre"
            control={form.control}
            label="Genre"
            options={GENRES}
            placeholder="Pick a genre"
          />
          <FormInput
            name="tags"
            control={form.control}
            label="Tags"
            placeholder="dark, analog, 90s"
          />
          <FormTextarea
            name="description"
            control={form.control}
            label="Description"
            placeholder="Anything worth knowing about this track"
            rows={4}
          />
          <Button variant="secondary" type="submit" loading={isPending}>
            Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
