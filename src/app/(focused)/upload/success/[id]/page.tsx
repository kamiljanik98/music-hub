import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCoverUrl } from "@/lib/r2/public";
import { Send } from "lucide-react";
import { CopyLinkButton } from "@/components/social/copy-link-button";

export default async function UploadSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data: song } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();

  if (!currentUser || song?.uploaded_by !== currentUser.id) {
    return notFound();
  }

  const songUrl = `${process.env.NEXT_PUBLIC_APP_URL}/songs/${song.id}`;
  const coverUrl = getCoverUrl(song.image_path);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <img
          src={coverUrl}
          alt={song.title}
          className="w-full aspect-square object-cover"
        />

        <div className="flex flex-col gap-1 border-l-2 border-border pl-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Uploaded
          </p>
          <h1 className="text-base font-semibold">{song.title}</h1>
          {song.genre && (
            <p className="text-xs text-muted-foreground">{song.genre}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            readOnly
            value={songUrl}
            className="text-xs text-muted-foreground h-9 bg-muted"
          />
          <CopyLinkButton path={`/songs/${song.id}`} />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            asChild
          >
            <Link href={songUrl}>
              <Send size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
