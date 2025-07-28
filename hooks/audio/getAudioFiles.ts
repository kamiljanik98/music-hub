'use client';

import { useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { usePlayer } from "../usePlayer";

export function getAudioFiles() {
  const setAudioFiles = usePlayer((state) => state.setAudioFiles);
  const setError = usePlayer((state) => state.setError);
  const setPlayerReady = usePlayer((state) => state.setPlayerReady);
  const { supabaseClient, session } = useSessionContext();

  useEffect(() => {
    if (!session) {
      setPlayerReady(false);
      return;
    }
    (async () => {
      setPlayerReady(false);
      const { data, error } = await supabaseClient
        .from('audio_files')
        .select('id, title, path, duration, created_at, uploaded_by, cover_url')
        .order('created_at', { ascending: false });
      if (!data || error) {
        setAudioFiles([]);
        setError(error?.message || "Failed to fetch audio files");
        setPlayerReady(false);
        return;
      }
      setAudioFiles(data);
      setPlayerReady(true);
    })();
  }, [supabaseClient, session, setAudioFiles, setError, setPlayerReady]);
} 