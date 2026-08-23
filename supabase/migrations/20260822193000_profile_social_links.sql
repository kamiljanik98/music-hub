alter table public.profiles add column social_links jsonb;

alter table public.profiles
  add constraint social_links_known_keys check (
    social_links is null
    or (
      jsonb_typeof(social_links) = 'object'
      and social_links - array['instagram', 'twitch', 'spotify'] = '{}'::jsonb
    )
  );
