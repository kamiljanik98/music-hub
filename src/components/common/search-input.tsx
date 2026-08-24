"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AudioLines, CornerDownLeft, Search, UserRound } from "lucide-react";
import { useSearchSuggestions } from "@/hooks/search/use-search-suggestions";
import { cn } from "@/lib/utils";
import { useSearchKeyboard } from "@/hooks/search/use-search-keyboard";

const LISTBOX_ID = "search-suggestions";
const optionId = (index: number) => `${LISTBOX_ID}-option-${index}`;

export const SearchInput = () => {
  const queryParam = useSearchParams().get("query") ?? "";
  const [lastQueryParam, setLastQueryParam] = useState(queryParam);
  const [value, setValue] = useState(queryParam);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  if (queryParam !== lastQueryParam) {
    setLastQueryParam(queryParam);
    setValue(queryParam);
  }

  const { suggestions } = useSearchSuggestions(value);

  const { activeIndex, setActiveIndex, handleKeyDown, reset } =
    useSearchKeyboard({
      items: suggestions,
      onSelect: (suggestion) => {
        const query =
          suggestion.type === "song" ? suggestion.title : suggestion.nickname;
        if (query) {
          navigateToSearch(query);
        }
      },
      onEscape: () => setIsOpen(false),
      onSubmit: () => navigateToSearch(value),
    });

  const navigateToSearch = (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) return;

    setValue(trimmed);
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  };

  const isExpanded = isOpen && suggestions.length > 0;

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2.5 rounded-[var(--mh-radius-pill)] border border-white/12 bg-[rgba(0,0,0,0.55)] px-5 py-3.5 transition-colors focus-within:border-primary/60 focus-within:bg-[rgba(0,0,0,0.7)] hover:border-white/20">
        <Search
          className="pointer-events-none size-4 shrink-0 text-[var(--mh-text-meta)]"
          strokeWidth={1.9}
        />

        <input
          className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-[var(--mh-text-meta)]"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
            reset();
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => value && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search tracks, artists, tags"
          role="combobox"
          aria-expanded={isExpanded}
          aria-controls={LISTBOX_ID}
          aria-activedescendant={
            activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          aria-autocomplete="list"
        />

        <span
          aria-hidden
          className="shrink-0 font-mono text-3xl text-[var(--mh-text-mono)]"
        >
          <CornerDownLeft size={12} />
        </span>
      </div>

      {isExpanded && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-[calc(100%+8px)] left-0 right-0 z-30 flex flex-col rounded-[24px] border border-white/12 bg-[var(--mh-solid)] p-2"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.id}`}
              id={optionId(index)}
              role="option"
              aria-selected={activeIndex === index}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md px-3.5 py-2.5 text-[15px] text-foreground",
                "hover:bg-[var(--mh-glass-hover)]",
                activeIndex === index && "bg-white/12 text-primary",
              )}
              onMouseDown={() => {
                const query =
                  suggestion.type === "song"
                    ? suggestion.title
                    : suggestion.nickname;

                if (query) {
                  navigateToSearch(query);
                }
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {suggestion.type === "song" ? (
                <AudioLines
                  className="size-3.5 shrink-0 text-[var(--mh-text-meta)]"
                  strokeWidth={1.9}
                />
              ) : (
                <UserRound
                  className="size-3.5 shrink-0 text-[var(--mh-text-meta)]"
                  strokeWidth={1.9}
                />
              )}

              <span className="min-w-0 flex-1 truncate">
                {suggestion.type === "song"
                  ? suggestion.title
                  : suggestion.nickname}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
