import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useSearchSuggestions } from "@/hooks/search/use-search-suggestions";
import { cn } from "@/lib/utils";
import { useSearchKeyboard } from "@/hooks/search/use-search-keyboard";

const LISTBOX_ID = "search-suggestions";
const optionId = (index: number) => `${LISTBOX_ID}-option-${index}`;

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { suggestions } = useSearchSuggestions(value);
  const { activeIndex, setActiveIndex, handleKeyDown, reset } =
    useSearchKeyboard({
      items: suggestions,
      onSelect: (song) => navigateToSearch(song.title),
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
    <div className="relative w-full max-w-sm">
      <div className="flex items-center gap-3.5 rounded-[var(--mh-radius-pill)] border border-border bg-[rgba(0,0,0,0.3)] px-5 py-[11px]">
        <Search
          className="pointer-events-none size-[18px] shrink-0 text-[var(--mh-text-meta)]"
          strokeWidth={1.9}
        />
        <input
          className="min-w-0 flex-1 border-none bg-transparent text-base font-medium text-foreground outline-none placeholder:text-[var(--mh-text-meta)]"
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
          className="shrink-0 font-mono text-xs text-[var(--mh-text-mono)]"
        >
          &#8629;
        </span>
      </div>
      {isExpanded && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-[calc(100%+8px)] left-0 right-0 z-30 flex flex-col rounded-[24px] border border-white/12 bg-[var(--mh-solid)] p-2"
        >
          {suggestions.map((song, index) => (
            <li
              key={song.id}
              id={optionId(index)}
              role="option"
              aria-selected={activeIndex === index}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-[15px] text-foreground",
                "hover:bg-[var(--mh-glass-hover)]",
                activeIndex === index && "bg-white/12 text-primary",
              )}
              onMouseDown={() => navigateToSearch(song.title)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <Search
                className="size-3.5 shrink-0 text-[var(--mh-text-meta)]"
                strokeWidth={1.9}
              />
              <span className="min-w-0 flex-1 truncate">{song.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
