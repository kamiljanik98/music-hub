create table public.plays (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  played_at timestamptz not null default now()
);

alter table public.plays enable row level security;

create policy "select own"
on public.plays for select
using ((select auth.uid()) = user_id);

create policy "insert own"
on public.plays for insert
with check ((select auth.uid()) = user_id);

create index plays_user_id_played_at_idx on public.plays (user_id, played_at desc);
create index plays_song_id_idx on public.plays (song_id);

grant select, insert on public.plays to authenticated;
grant select, insert, update, delete on public.plays to service_role;

alter table public.songs add column play_count integer not null default 0;

alter table public.songs
  add constraint play_count_non_negative check (play_count >= 0);

create or replace function public.record_play(p_song_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  listener uuid := (select auth.uid());
begin
  if listener is null then
    raise exception 'not authenticated';
  end if;

  insert into public.plays (user_id, song_id)
  values (listener, p_song_id);

  update public.songs
  set play_count = play_count + 1
  where id = p_song_id;
end;
$$;

revoke execute on function public.record_play(uuid) from public, anon;
grant execute on function public.record_play(uuid) to authenticated;
