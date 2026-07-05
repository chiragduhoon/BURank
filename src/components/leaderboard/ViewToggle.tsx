"use client";

import { motion } from "framer-motion";
import { Swords, User } from "lucide-react";

export type ViewMode = "individuals" | "batches";

interface Props {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const OPTIONS: { key: ViewMode; label: string; icon: typeof User }[] = [
  { key: "individuals", label: "Individuals", icon: User },
  { key: "batches", label: "Batch Wars", icon: Swords },
];

export default function ViewToggle({ viewMode, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface/70 p-1">
      {OPTIONS.map(({ key, label, icon: Icon }) => {
        const active = viewMode === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`focus-ring relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              active ? "text-fg" : "text-fg-muted hover:text-fg-secondary"
            }`}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="view-toggle-pill"
                className="absolute inset-0 rounded-lg border border-accent/35 bg-accent-solid/10 shadow-[inset_0_0_18px_rgb(var(--accent-solid)/0.07)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={14} />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
