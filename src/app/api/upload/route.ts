import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  uploadSong,
  uploadCover,
  uploadStem,
  deleteFromR2,
} from "@/lib/r2/upload";
import type { Database } from "@/types/database.types";
import { validateImageFile } from "@/lib/validations/files";
import {
  ACCEPTED_AUDIO,
  type AcceptedAudioMimeType,
  MAX_AUDIO_SIZE_BYTES,
  MAX_AUDIO_SIZE_MB,
} from "@/lib/constants";

type SongInsert = Database["public"]["Tables"]["songs"]["Insert"];
type StemInsert = Database["public"]["Tables"]["stems"]["Insert"];
type StemCategory = Database["public"]["Enums"]["stem_category"];

function isAcceptedAudioMime(type: string): type is AcceptedAudioMimeType {
  return type in ACCEPTED_AUDIO;
}

const STEM_CATEGORIES: StemCategory[] = [
  "vocals",
  "drums",
  "bass",
  "melody",
  "guitar",
  "synth",
  "fx",
  "other",
];

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const audioFile = formData.get("audio");
  const coverFile = formData.get("cover");
  const title = formData.get("title");
  const bpm = formData.get("bpm");
  const scale = formData.get("scale");
  const genre = formData.get("genre");
  const tags = formData.get("tags");
  const description = formData.get("description") as string | null;

  if (!(audioFile instanceof File)) {
    return NextResponse.json({ error: "Audio file required" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }

  if (!isAcceptedAudioMime(audioFile.type)) {
    return NextResponse.json(
      { error: "Unsupported audio format" },
      { status: 415 },
    );
  }
  if (audioFile.size > MAX_AUDIO_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Audio file exceeds ${MAX_AUDIO_SIZE_MB} MB limit` },
      { status: 413 },
    );
  }
  if (coverFile instanceof File) {
    const { error, code } = validateImageFile(coverFile);
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: code === "FORMAT" ? 415 : 413 },
      );
    }
  }

  const MAX_STEMS = 10;
  if (formData.has(`stems[${MAX_STEMS}].file`)) {
    return NextResponse.json(
      { error: `Maximum ${MAX_STEMS} stems per song` },
      { status: 400 },
    );
  }

  const stems: { file: File; category: StemCategory }[] = [];
  for (let i = 0; i < MAX_STEMS; i++) {
    const file = formData.get(`stems[${i}].file`);
    const category = formData.get(`stems[${i}].category`);

    if (file === null && category === null) break;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Invalid stem file" }, { status: 400 });
    }
    if (!isAcceptedAudioMime(file.type)) {
      return NextResponse.json(
        { error: "Unsupported stem audio format" },
        { status: 415 },
      );
    }
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Stem file exceeds ${MAX_AUDIO_SIZE_MB} MB limit` },
        { status: 413 },
      );
    }
    if (
      typeof category !== "string" ||
      !STEM_CATEGORIES.includes(category as StemCategory)
    ) {
      return NextResponse.json(
        { error: "Invalid stem category" },
        { status: 400 },
      );
    }

    stems.push({ file, category: category as StemCategory });
  }

  const written: { bucket: "songs" | "covers" | "stems"; path: string }[] = [];

  const rollback = async () => {
    await Promise.allSettled(
      written.map(({ bucket, path }) => deleteFromR2(bucket, path)),
    );
  };

  const audioPath = `${user.id}/${crypto.randomUUID()}-${audioFile.name}`;
  try {
    await uploadSong(audioFile, audioPath);
  } catch {
    await rollback();
    return NextResponse.json({ error: "Audio upload failed" }, { status: 500 });
  }
  written.push({ bucket: "songs", path: audioPath });

  let coverPath: string | null = null;
  if (coverFile instanceof File) {
    coverPath = `${user.id}/${crypto.randomUUID()}-${coverFile.name}`;
    try {
      await uploadCover(coverFile, coverPath);
    } catch {
      await rollback();
      return NextResponse.json(
        { error: "Cover upload failed" },
        { status: 500 },
      );
    }
    written.push({ bucket: "covers", path: coverPath });
  }

  const stemPaths: { path: string; category: StemCategory }[] = [];
  for (const { file, category } of stems) {
    const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
    try {
      await uploadStem(file, path);
    } catch {
      await rollback();
      return NextResponse.json(
        { error: "Stem upload failed" },
        { status: 500 },
      );
    }
    written.push({ bucket: "stems", path });
    stemPaths.push({ path, category });
  }

  const insert: SongInsert = {
    title: title.trim(),
    path: audioPath,
    image_path: coverPath,
    uploaded_by: user.id,
    bpm: bpm ? Number(bpm) : null,
    scale: typeof scale === "string" ? scale : null,
    genre: typeof genre === "string" ? genre : null,
    tags:
      typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : null,
    description: description ?? null,
  };

  const { data: song, error: dbError } = await supabase
    .from("songs")
    .insert(insert)
    .select()
    .single();

  if (dbError || !song) {
    await rollback();
    return NextResponse.json(
      { error: dbError?.message ?? "DB insert failed" },
      { status: 500 },
    );
  }

  if (stemPaths.length > 0) {
    const stemInserts: StemInsert[] = stemPaths.map(({ path, category }) => ({
      song_id: song.id,
      path,
      category,
    }));

    const { error: stemsDbError } = await supabase
      .from("stems")
      .insert(stemInserts);

    if (stemsDbError) {
      await rollback();
      await supabase.from("songs").delete().eq("id", song.id);
      return NextResponse.json(
        { error: stemsDbError.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ song }, { status: 201 });
}
