import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { AudioFile, usePlayer } from "../usePlayer";

export function getAudioUrls(audioFiles: AudioFile[]) {
  const setAudioUrls = usePlayer((state) => state.setAudioUrls);
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
  }, [audioFiles, supabaseClient, setAudioUrls]);
} 