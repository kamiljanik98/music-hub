import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { AudioFile } from "./getAudioFiles";

export function useAudioUrls(audioFiles: AudioFile[]) {
  const [audioUrls, setAudioUrls] = useState<{ file: AudioFile; url: string | null }[]>([]);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!audioFiles.length || !supabaseClient) {
      setAudioUrls([]);
      return;
    }

    const urls = audioFiles.map((file) => {
      const { data: urlData } = supabaseClient
        .storage
        .from("audio")
        .getPublicUrl(file.path);
      return { file, url: urlData?.publicUrl || null };
    });

    setAudioUrls(urls);
  }, [audioFiles, supabaseClient]);

  return audioUrls;
} 