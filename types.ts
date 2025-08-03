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

export type UserDetails = {
  id: string;
  nickname: string;
  avatar_url: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
};
