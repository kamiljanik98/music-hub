import { getSearchedSongs } from "@/actions/songs/get-searched-songs";
import { Content } from "@/components/search/content";
import { createClient } from "@/lib/supabase/server";

const RESULT_LIMIT = 24;
const USER_LIMIT = 8;

type SearchPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;

  if (!query?.trim()) {
    return <Content songs={[]} users={[]} query={query} />;
  }

  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, nickname, avatar_url")
    .ilike("nickname", `%${query}%`)
    .limit(USER_LIMIT);

  const { data: songs, error } = await getSearchedSongs(
    query,
    RESULT_LIMIT - (users?.length ?? 0),
  );

  if (error) {
    return (
      <p className="text-destructive p-6 text-sm">
        Failed to load search results
      </p>
    );
  }

  return <Content songs={songs} users={users ?? []} query={query} />;
}
