import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CityOption } from "@/lib/weather";
import { cn } from "@/lib/utils";

export function SearchBar({
  cities,
  selectedId,
  onSelect,
}: {
  cities: CityOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    );
  }, [cities, query]);

  return (
    <div className="relative w-full">
      <div className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
        <Search className="size-4 opacity-60" strokeWidth={1.8} aria-hidden />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          placeholder="Search a city…"
          aria-label="Search a city"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="glass-panel absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl p-1.5">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onMouseDown={() => {
                  onSelect(c.id);
                  setQuery("");
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-foreground/10",
                  c.id === selectedId && "bg-foreground/10",
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs tracking-widest text-muted-foreground">{c.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
