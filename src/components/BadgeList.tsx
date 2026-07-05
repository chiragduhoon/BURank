"use client";

import { BADGE_ICONS } from "@/lib/badge-icons";
import { Badge, TIER_STYLE } from "@/lib/badges";

interface Props {
  badges: Badge[];
  // compact = small inline pills (for leaderboard rows)
  // full    = larger cards with description (for profile modal)
  variant?: "compact" | "full";
  // compact only: show at most this many pills, then a "+N" chip
  max?: number;
}

// Tier colors come from TIER_STYLE data, so they stay as inline style —
// everything structural is Tailwind.
function Tooltip({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-border-strong bg-surface-raised px-2 py-1 text-[11px] text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      {text}
    </span>
  );
}

export default function BadgeList({ badges, variant = "compact", max }: Props) {
  if (badges.length === 0) {
    return <span className="text-xs text-fg-muted">No badges yet</span>;
  }

  if (variant === "compact") {
    const visible = max ? badges.slice(0, max) : badges;
    const hidden = badges.length - visible.length;
    return (
      <div className="relative flex flex-wrap gap-1.5">
        {visible.map((badge) => {
          const s = TIER_STYLE[badge.tier];
          const Icon = BADGE_ICONS[badge.id as keyof typeof BADGE_ICONS];
          return (
            <span
              key={badge.id}
              tabIndex={0}
              className="group relative inline-flex cursor-default select-none items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium outline-none"
              style={{
                background: s.bg,
                color: s.text,
                borderColor: s.border,
              }}
            >
              {Icon ? (
                <Icon size={11} strokeWidth={2.2} color={s.dot} />
              ) : (
                <span
                  className="size-[5px] shrink-0 rounded-full"
                  style={{ background: s.dot }}
                />
              )}
              {badge.label}
              <Tooltip text={badge.description} />
            </span>
          );
        })}
        {hidden > 0 && (
          <span
            tabIndex={0}
            className="group relative inline-flex cursor-default select-none items-center rounded border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-fg-muted outline-none"
          >
            +{hidden}
            <Tooltip
              text={badges
                .slice(visible.length)
                .map((b) => b.label)
                .join(" · ")}
            />
          </span>
        )}
      </div>
    );
  }

  // full variant — cards with description, used in profile modal
  const tierOrder: Badge["tier"][] = ["elite", "gold", "silver", "bronze"];
  const grouped = tierOrder.reduce<Record<string, Badge[]>>((acc, tier) => {
    acc[tier] = badges.filter((b) => b.tier === tier);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {tierOrder.map((tier) => {
        const group = grouped[tier];
        if (!group || group.length === 0) return null;
        const s = TIER_STYLE[tier];

        return (
          <div key={tier}>
            <p
              className="mb-2 text-[11px] font-medium uppercase tracking-wider"
              style={{ color: s.text }}
            >
              {tier}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
              {group.map((badge) => {
                const Icon = BADGE_ICONS[badge.id as keyof typeof BADGE_ICONS];
                return (
                  <div
                    key={badge.id}
                    className="rounded-md border px-3 py-2.5"
                    style={{ background: s.bg, borderColor: s.border }}
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      {Icon ? (
                        <Icon size={13} strokeWidth={2.2} color={s.dot} />
                      ) : (
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{ background: s.dot }}
                        />
                      )}
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: s.text }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="pl-[18px] text-[11px] text-fg-muted">
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
