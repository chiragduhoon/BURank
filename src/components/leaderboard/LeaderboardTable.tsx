"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Crown,
  Droplet,
  Trophy,
} from "lucide-react";
import { computeBadges } from "@/lib/badges";
import BadgeList from "@/components/BadgeList";
import SkeletonRows from "@/components/SkeletonRows";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { LeetCodeUser, SortDirection, SortKey } from "@/types";

interface Props {
  users: LeetCodeUser[];
  totalCount: number;
  loading: boolean;
  search: string;
  sortKey: SortKey;
  sortDir: SortDirection;
  onSort: (key: SortKey) => void;
  firstBlood: string;
  onSelect: (user: LeetCodeUser, rank: number) => void;
  onJoin: () => void;
}

const RANK_CLASSES: Record<number, string> = {
  1: "text-gold",
  2: "text-silver",
  3: "text-bronze",
};

const RANK_BARS: Record<number, string> = {
  1: "bg-gold",
  2: "bg-silver",
  3: "bg-bronze",
};

const RANK_RINGS: Record<number, string> = {
  1: "ring-2 ring-gold/70",
  2: "ring-2 ring-silver/60",
  3: "ring-2 ring-bronze/60",
};

export function RankLabel({ rank }: { rank: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-sm font-semibold tabular-nums ${
        RANK_CLASSES[rank] ?? "font-normal text-fg-muted"
      }`}
    >
      #{rank}
      {rank === 1 && <Crown size={13} className="text-gold" />}
    </span>
  );
}

export function Avatar({
  user,
  size = 32,
  rank,
}: {
  user: LeetCodeUser;
  size?: number;
  rank?: number;
}) {
  const ring = rank ? (RANK_RINGS[rank] ?? "ring-1 ring-border") : "ring-1 ring-border";
  return user.avatar ? (
    <Image
      src={user.avatar}
      alt={user.username}
      width={size}
      height={size}
      className={`rounded-full ${ring}`}
      unoptimized
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-solid text-xs font-bold text-white ${ring}`}
    >
      {user.username[0]?.toUpperCase()}
    </div>
  );
}

function SortableHeader({
  label,
  col,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const active = sortKey === col;
  const ariaSort = active
    ? sortDir === "desc"
      ? "descending"
      : "ascending"
    : undefined;
  return (
    <th aria-sort={ariaSort} className="whitespace-nowrap px-6 py-0 font-medium">
      <button
        onClick={() => onSort(col)}
        className="focus-ring inline-flex h-10 items-center gap-1 whitespace-nowrap rounded text-header-fg/80 transition-colors hover:text-header-fg"
      >
        {label}
        {active ? (
          sortDir === "desc" ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronUp size={13} />
          )
        ) : (
          <ChevronsUpDown size={13} className="opacity-50" />
        )}
      </button>
    </th>
  );
}

export default function LeaderboardTable({
  users,
  totalCount,
  loading,
  search,
  sortKey,
  sortDir,
  onSort,
  firstBlood,
  onSelect,
  onJoin,
}: Props) {
  const sortProps = { sortKey, sortDir, onSort };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/70 shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-header text-left font-mono text-[10px] uppercase tracking-[0.14em] text-header-fg">
              <th className="w-16 px-6 py-3 font-medium">Rank</th>
              <th className="px-6 py-3 font-medium">Coder</th>
              <SortableHeader label="Batch" col="yearStudying" {...sortProps} />
              <SortableHeader label="Solved" col="totalSolved" {...sortProps} />
              <th className="px-6 py-3 font-medium">E / M / H</th>
              <SortableHeader
                label="Contest"
                col="contestRating"
                {...sortProps}
              />
              <SortableHeader label="Global Rank" col="ranking" {...sortProps} />
              <th className="px-6 py-3 font-medium">Badges</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows count={6} />
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState
                    icon={Trophy}
                    title={search ? "No results found" : "No coders yet"}
                    description={
                      search
                        ? "Try a different search"
                        : "Be the first to join the leaderboard!"
                    }
                    action={
                      !search ? (
                        <Button onClick={onJoin}>Join Now</Button>
                      ) : undefined
                    }
                  />
                </td>
              </tr>
            ) : (
              users.map((user, i) => {
                const rank = i + 1;
                return (
                  <motion.tr
                    key={user.username}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i, 15) * 0.02,
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${user.username}'s profile`}
                    onClick={() => onSelect(user, rank)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(user, rank);
                      }
                    }}
                    className="focus-ring group cursor-pointer border-b border-border/70 transition-all last:border-0 odd:bg-surface/40 even:bg-surface-raised/45 hover:bg-accent-solid/[0.07]"
                  >
                    <td className="relative w-16 px-6 py-4">
                      {RANK_BARS[rank] && (
                        <span
                          className={`absolute left-0 top-0 h-full w-[3px] shadow-[0_0_12px_currentColor] ${RANK_BARS[rank]}`}
                        />
                      )}
                      <RankLabel rank={rank} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={user} rank={rank} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/user/${user.username}`}
                              onClick={(e) => e.stopPropagation()}
                              className="block max-w-[160px] truncate font-mono text-sm font-semibold text-fg transition-colors group-hover:text-accent hover:underline"
                            >
                              {user.username}
                            </Link>
                            {firstBlood === user.username && (
                              <span
                                title="First Blood (Question of the Week)"
                                className="cursor-help text-accent"
                              >
                                <Droplet size={13} />
                              </span>
                            )}
                          </div>
                          {user.realName &&
                            user.realName !== user.username && (
                              <p className="text-xs text-fg-muted">
                                {user.realName}
                              </p>
                            )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-sm tabular-nums text-fg-muted">
                        {user.yearStudying || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-base font-semibold tabular-nums text-fg">
                        {user.totalSolved}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-sm tabular-nums">
                        <span className="text-easy">{user.easySolved}</span>
                        <span className="text-fg-muted/40">·</span>
                        <span className="text-medium">{user.mediumSolved}</span>
                        <span className="text-fg-muted/40">·</span>
                        <span className="text-hard">{user.hardSolved}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {user.contestRating > 0 ? (
                        <div className="whitespace-nowrap">
                          <span className="font-mono font-semibold tabular-nums text-fg">
                            {user.contestRating}
                          </span>
                          <span className="ml-1 text-xs text-fg-muted">
                            ({user.attendedContestsCount} contests)
                          </span>
                        </div>
                      ) : (
                        <span className="text-fg-muted/40">—</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-mono text-sm tabular-nums text-fg-muted">
                        #{user.ranking?.toLocaleString() ?? "—"}
                      </span>
                    </td>

                    <td className="min-w-[220px] px-6 py-4">
                      <BadgeList
                        badges={computeBadges(user)}
                        variant="compact"
                        max={3}
                      />
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between border-t border-border bg-bg/45 px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-fg-muted">
          <span>
            Showing {users.length} of {totalCount} coders
          </span>
          <span>
            Data via{" "}
            <a
              href="https://leetcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              LeetCode
            </a>{" "}
            · Refreshes every 5 min
          </span>
        </div>
      )}
    </div>
  );
}
