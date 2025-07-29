export type Song = {
  id: number;
  title: string;
  path: string;
  duration: number;
  created_at: string;
  uploaded_by: string;
  image_path: string | null;
};

export type SongUrl = {
  file: Song;
  url: string | null;
};
