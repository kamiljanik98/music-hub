import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Song } from '@/types';

const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();

  if (!song) return 'No songs found :(';

  const { data: songData } = supabaseClient.storage.from('audio').getPublicUrl(song.path);

  return songData.publicUrl;
};

export default useLoadSongUrl;
