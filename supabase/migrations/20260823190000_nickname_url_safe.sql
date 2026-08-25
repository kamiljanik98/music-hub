do $$
declare
  profile record;
  base text;
  candidate text;
  suffix int;
begin
  for profile in
    select id, nickname
    from public.profiles
    where nickname is not null
      and nickname !~ '^[a-zA-Z0-9_.-]{3,32}$'
  loop
    base := regexp_replace(profile.nickname, '[^a-zA-Z0-9_.-]', '', 'g');
    base := left(base, 32);

    if length(base) < 3 then
      base := left('user' || base, 32);
    end if;

    candidate := base;
    suffix := 1;

    while exists (
      select 1
      from public.profiles other
      where other.nickname = candidate
        and other.id <> profile.id
    ) loop
      candidate := left(base, 32 - length(suffix::text)) || suffix::text;
      suffix := suffix + 1;
    end loop;

    update public.profiles
    set nickname = candidate
    where id = profile.id;
  end loop;
end $$;

alter table public.profiles
  add constraint profiles_nickname_url_safe
  check (nickname is null or nickname ~ '^[a-zA-Z0-9_.-]{3,32}$');
