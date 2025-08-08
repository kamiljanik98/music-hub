export type Song = {
  id: string;
  title: string;
  uploaded_by: string;
  path: string;
  image_path: string;
  bpm?: number;
  scale?: string;
  genre?: string;
  tags?: string[];
  profiles?: {
    nickname?: string;
  };
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
