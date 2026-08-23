import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { createClient } from "@/lib/supabase/client";

export type SongSuggestion = {
  type: "song";
  id: string;
  title: string;
};

export type UserSuggestion = {
  type: "user";
  id: string;
  nickname: string | null;
};

export type SearchSuggestion = SongSuggestion | UserSuggestion;

export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceQuery = useDebounce(query, 300);
  const trimmed = debounceQuery.trim();

  useEffect(() => {
    if (!trimmed) {
      return;
    }

    let cancelled = false;

    const fetchSuggestions = async () => {
      setIsLoading(true);

      const supabase = createClient();

      const [{ data: songs }, { data: users }] = await Promise.all([
        supabase
          .from("songs")
          .select("id, title")
          .ilike("title", `%${trimmed}%`)
          .limit(8),

        supabase
          .from("profiles")
          .select("id, nickname")
          .ilike("nickname", `%${trimmed}%`)
          .limit(8),
      ]);

      if (!cancelled) {
        setSuggestions([
          ...(songs ?? []).map((song) => ({
            type: "song" as const,
            id: song.id,
            title: song.title,
          })),

          ...(users ?? []).map((user) => ({
            type: "user" as const,
            id: user.id,
            nickname: user.nickname,
          })),
        ]);

        setIsLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [trimmed]);

  return {
    suggestions: trimmed ? suggestions : [],
    isLoading,
  };
};
