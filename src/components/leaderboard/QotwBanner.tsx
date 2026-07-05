"use client";

import { Droplet, ExternalLink, Flame } from "lucide-react";

interface Props {
  qotw: string;
  firstBlood: string;
}

export default function QotwBanner({ qotw, firstBlood }: Props) {
  if (!qotw) return null;

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-accent/30 bg-[linear-gradient(110deg,rgb(var(--accent-solid)/0.16),rgb(var(--surface)/0.82)_42%,rgb(var(--surface)/0.7))] p-4 shadow-[0_0_36px_rgb(var(--accent-solid)/0.06)] sm:p-5">
      <div aria-hidden className="absolute right-20 top-1/2 h-28 w-px -translate-y-1/2 rotate-[28deg] bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent-solid/20 shadow-[0_0_20px_rgb(var(--accent-solid)/0.2)]">
            <Flame size={18} className="text-accent" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-fg">
                Daily Mission
              </h2>
              {firstBlood && (
                <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-solid/10 px-2 py-0.5 text-xs font-medium text-accent">
                  <Droplet size={11} />
                  First Blood: {firstBlood}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-fg-muted">
              One problem. One day. Claim first blood.
            </p>
          </div>
        </div>
        <a
          href={qotw}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex shrink-0 items-center gap-2 rounded-md bg-accent-solid px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Solve on LeetCode
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
