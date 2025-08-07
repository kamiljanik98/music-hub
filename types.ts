export type Song = {
  id: string;
  title: string;
  path: string;
  duration: number | null;
  created_at: string;
  uploaded_by: string | null;
  image_path: string | null;
};

export type SongUrl = {
  file: Song;
  url: string | null;
};

export type UserDetails = {
  id: string;
  nickname: string;
  avatar_url: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
};
