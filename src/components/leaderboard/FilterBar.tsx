"use client";

import { RefObject } from "react";
import { Search } from "lucide-react";

export type Filter = "all" | "top10" | "contested";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  filter: Filter;
  onFilter: (value: Filter) => void;
  searchRef: RefObject<HTMLInputElement>;
}

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  top10: "Top 10",
  contested: "Contestants",
};

export default function FilterBar({
  search,
  onSearch,
  filter,
  onFilter,
  searchRef,
}: Props) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
        />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by name or username…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface/70 py-3 pl-10 pr-10 text-sm text-fg outline-none transition-all placeholder:text-fg-muted/60 hover:border-border-strong focus:border-accent/70 focus:bg-surface focus:ring-2 focus:ring-accent/15"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-fg-muted sm:block">
          /
        </kbd>
      </div>
      <div className="flex gap-2">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            aria-pressed={filter === f}
            className={`focus-ring rounded-lg border px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all ${
              filter === f
                ? "border-accent/50 bg-accent-solid/10 text-accent shadow-[inset_0_0_18px_rgb(var(--accent-solid)/0.08)]"
                : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg-secondary"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
    </div>
  );
}
