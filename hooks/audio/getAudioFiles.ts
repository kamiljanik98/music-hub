'use client';

import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export type AudioFile = {
  id: number;
  title: string;
  path: string;
  duration: number;
  created_at: string;
  uploaded_by: string;
  cover_url: string | null; // Add this line
};

export function useAudioFiles() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabaseClient
        .from('audio_files')
        .select('id, title, path, duration, created_at, uploaded_by, cover_url')
        .order('created_at', { ascending: false });
      if (!data || error) {
        setAudioFiles([]);
        setLoading(false);
        return;
      }
      setAudioFiles(data);
      setLoading(false);
    })();
  }, [supabaseClient]);

  return { audioFiles, loading };
} 