import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title: string): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  if (!title) {
    return await getSongs();
  }

  const { data, error } = await supabase
    .from("audio_files")
    .select("*, profiles(nickname)")
    .or(`title.ilike.%${title}%,tags.cs.{${title}},genre.ilike.%${title}%,scale.ilike.%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Search error:", error);
  }

  return (data ?? []) as Song[];
};

export default getSongsByTitle;
