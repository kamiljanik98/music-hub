import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("audio_files")
    .select("*, profiles(nickname)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (data ?? []) as Song[];
};

export default getSongs;
