import { useState } from "react";

type UseSearchKeyboardProps<T> = {
  items: T[];
  onSelect: (item: T) => void;
  onEscape?: () => void;
  onSubmit?: () => void;
};

export const useSearchKeyboard = <T>({
  items,
  onSelect,
  onEscape,
  onSubmit,
}: UseSearchKeyboardProps<T>) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && items.length) {
      e.preventDefault();

      setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp" && items.length) {
      e.preventDefault();

      setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        onSelect(items[activeIndex]);
      } else {
        onSubmit?.();
      }
    }

    if (e.key === "Escape") {
      setActiveIndex(-1);
      onEscape?.();
    }
  };

  const reset = () => {
    setActiveIndex(-1);
  };

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    reset,
  };
};
