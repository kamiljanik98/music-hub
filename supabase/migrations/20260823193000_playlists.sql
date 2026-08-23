create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint playlist_title_length check (char_length(title) between 1 and 80),
  constraint playlist_description_length check (
    description is null or char_length(description) <= 500
  )
);

create table public.playlist_songs (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  position integer not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, song_id),
  constraint playlist_song_position_non_negative check (position >= 0)
);

create index playlists_owner_id_created_at_idx
  on public.playlists (owner_id, created_at desc);

create index playlist_songs_playlist_id_position_idx
  on public.playlist_songs (playlist_id, position);

create index playlist_songs_song_id_idx on public.playlist_songs (song_id);

alter table public.playlists enable row level security;

alter table public.playlist_songs enable row level security;

create policy "select public or own"
on public.playlists for select
using (is_public or (select auth.uid()) = owner_id);

create policy "insert own"
on public.playlists for insert
with check ((select auth.uid()) = owner_id);

create policy "update own"
on public.playlists for update
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "delete own"
on public.playlists for delete
using ((select auth.uid()) = owner_id);

create policy "select songs of visible playlists"
on public.playlist_songs for select
using (
  exists (
    select 1
    from public.playlists playlist
    where playlist.id = playlist_id
      and (playlist.is_public or playlist.owner_id = (select auth.uid()))
  )
);

create policy "insert songs into own playlists"
on public.playlist_songs for insert
with check (
  exists (
    select 1
    from public.playlists playlist
    where playlist.id = playlist_id
      and playlist.owner_id = (select auth.uid())
  )
);

create policy "update songs in own playlists"
on public.playlist_songs for update
using (
  exists (
    select 1
    from public.playlists playlist
    where playlist.id = playlist_id
      and playlist.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.playlists playlist
    where playlist.id = playlist_id
      and playlist.owner_id = (select auth.uid())
  )
);

create policy "delete songs from own playlists"
on public.playlist_songs for delete
using (
  exists (
    select 1
    from public.playlists playlist
    where playlist.id = playlist_id
      and playlist.owner_id = (select auth.uid())
  )
);

grant select on public.playlists to anon;
grant select, insert, update, delete on public.playlists to authenticated;
grant select, insert, update, delete on public.playlists to service_role;

grant select on public.playlist_songs to anon;
grant select, insert, update, delete on public.playlist_songs to authenticated;
grant select, insert, update, delete on public.playlist_songs to service_role;
