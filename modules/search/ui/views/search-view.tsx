"use client";

import { useState } from "react";
import SearchInput from "@/modules/search/ui/components/search-input";
import SearchContent from "@/modules/search/ui/components/search-content";
import useSongSearch from "@/hooks/useSongSearch";
import useDebounce from "@/hooks/useDebounce";

export default function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1000);
  const songs = useSongSearch(debouncedQuery);

  return (
    <div className="flex h-full w-full flex-col justify-start items-center gap-2">
      <SearchInput value={query} onChange={setQuery} />
      <SearchContent songs={songs} query={!!query} />
    </div>
  );
}
