alter table public.profiles
  drop constraint social_links_known_keys;

update public.profiles
set social_links = social_links - 'twitch'
where social_links ? 'twitch';

update public.profiles
set social_links = null
where social_links = '{}'::jsonb;

alter table public.profiles
  add constraint social_links_known_keys check (
    social_links is null
    or (
      jsonb_typeof(social_links) = 'object'
      and social_links - array['youtube', 'instagram', 'tiktok', 'spotify', 'soundcloud'] = '{}'::jsonb
    )
  );
