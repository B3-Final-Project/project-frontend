import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Check } from "lucide-react";

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  suggestions: string[];
  loading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  suggestions,
  loading,
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (suggestions.length > 0 && value) setOpen(true);
    else setOpen(false);
    setHighlighted(-1);
  }, [suggestions, value]);

  useEffect(() => {
    if (!open) setHighlighted(-1);
  }, [open]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelect = (val: string) => {
    onSelect(val);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h < suggestions.length - 1 ? h + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h > 0 ? h - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < suggestions.length) {
        handleSelect(suggestions[highlighted]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[highlighted] as HTMLElement;
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls="autocomplete-listbox"
        aria-expanded={open}
        aria-activedescendant={highlighted >= 0 ? `autocomplete-item-${highlighted}` : undefined}
        disabled={disabled}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Loader2 className="animate-spin h-4 w-4" />
        </span>
      )}
      {open && (
        <ul
          ref={listRef}
          id="autocomplete-listbox"
          role="listbox"
          className="absolute z-10 mt-1 w-full bg-popover border border-input rounded-md shadow-lg max-h-48 overflow-auto"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              id={`autocomplete-item-${i}`}
              role="option"
              aria-selected={highlighted === i}
              className={`px-3 py-2 cursor-pointer select-none ${highlighted === i ? "bg-accent text-accent-foreground" : ""}`}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={() => setHighlighted(i)}
            >
              {s}
              {value === s && <Check className="inline ml-2 h-4 w-4 text-green-500" />}
            </li>
          ))}
          {suggestions.length === 0 && !loading && (
            <li className="px-3 py-2 text-muted-foreground select-none">No suggestions</li>
          )}
        </ul>
      )}
    </div>
  );
}; 