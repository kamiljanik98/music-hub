import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
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
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        variant="filled"
        className="pl-9"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsOpen(true);
          reset();
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Search tracks..."
        role="combobox"
        aria-expanded={isExpanded}
        aria-controls={LISTBOX_ID}
        aria-activedescendant={
          activeIndex >= 0 ? optionId(activeIndex) : undefined
        }
        aria-autocomplete="list"
      />
      {isExpanded && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-card"
        >
          {suggestions.map((song, index) => (
            <li
              key={song.id}
              id={optionId(index)}
              role="option"
              aria-selected={activeIndex === index}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm text-foreground hover:bg-muted",
                activeIndex === index && "bg-muted",
              )}
              onMouseDown={() => navigateToSearch(song.title)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {song.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
