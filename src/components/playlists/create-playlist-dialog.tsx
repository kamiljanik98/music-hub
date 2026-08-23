"use client";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FormInput from "@/components/form/form-input";
import FormTextarea from "@/components/form/form-textarea";
import { createPlaylist } from "@/actions/playlists/create-playlist";
import {
  playlistSchema,
  type PlaylistFormValues,
} from "@/lib/validations/playlist";

const EMPTY_VALUES: PlaylistFormValues = {
  title: "",
  description: "",
  isPublic: true,
};

type CreatePlaylistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (playlistId: string) => void;
};

export function CreatePlaylistDialog({
  open,
  onOpenChange,
  onCreated,
}: CreatePlaylistDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: EMPTY_VALUES,
    mode: "onBlur",
  });

  const onSubmit = (values: PlaylistFormValues) => {
    startTransition(async () => {
      const { data, error } = await createPlaylist({
        title: values.title,
        description: values.description,
        isPublic: values.isPublic,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Playlist created");
      onOpenChange(false);
      if (data) onCreated?.(data.id);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) form.reset(EMPTY_VALUES);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New playlist</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput
            name="title"
            control={form.control}
            label="Title"
            placeholder="Late night loops"
          />

          <FormTextarea
            name="description"
            control={form.control}
            label="Description"
            placeholder="What holds this set together?"
          />

          <Controller
            name="isPublic"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="isPublic" className="text-sm">
                    {field.value ? "Public" : "Private"}
                  </Label>

                  <span className="text-xs text-muted-foreground">
                    {field.value
                      ? "Anyone can open this playlist"
                      : "Only you can open this playlist"}
                  </span>
                </div>

                <Switch
                  id="isPublic"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create playlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
