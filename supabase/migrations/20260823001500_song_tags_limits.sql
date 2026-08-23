create or replace function public.tags_within_limits(tags text[])
returns boolean
language sql
immutable
as $$
  select tags is null
    or (
      array_length(tags, 1) <= 8
      and not exists (
        select 1
        from unnest(tags) as tag
        where char_length(tag) > 24
          or char_length(btrim(tag)) = 0
      )
    );
$$;

alter table public.songs
  add constraint tags_within_limits check (public.tags_within_limits(tags));
