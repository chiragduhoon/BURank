"use client";

import { BADGE_ICONS } from "@/lib/badge-icons";
import { Badge, TIER_STYLE } from "@/lib/badges";

interface Props {
  badge: Badge;
  size?: "sm" | "md";
}

export default function BadgePill({ badge, size = "md" }: Props) {
  const isSmall = size === "sm";
  const style = TIER_STYLE[badge.tier];
  const Icon = BADGE_ICONS[badge.id as keyof typeof BADGE_ICONS];

  return (
    <span
      tabIndex={0}
      className={`group relative inline-flex cursor-default select-none items-center whitespace-nowrap rounded-md border font-medium outline-none ${
        isSmall ? "gap-1 px-2 py-0.5 text-[11px]" : "gap-1.5 px-2.5 py-1 text-xs"
      }`}
      style={{
        background: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {Icon ? (
        <Icon size={isSmall ? 12 : 15} strokeWidth={2.2} color={style.dot} />
      ) : (
        <span
          className={`shrink-0 rounded-full ${isSmall ? "size-1.5" : "size-2"}`}
          style={{ background: style.dot }}
        />
      )}
      {badge.label}

      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded border border-border-strong bg-surface-raised px-2 py-1 text-[11px] text-fg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {badge.description}
      </span>
    </span>
  );
}
