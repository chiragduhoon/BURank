"use client";

import { motion } from "framer-motion";
import { Droplet, Trophy } from "lucide-react";
import { SkeletonCards } from "@/components/SkeletonRows";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { LeetCodeUser } from "@/types";
import { Avatar, RankLabel } from "./LeaderboardTable";

interface Props {
  users: LeetCodeUser[];
  loading: boolean;
  search: string;
  firstBlood: string;
  onSelect: (user: LeetCodeUser, rank: number) => void;
  onJoin: () => void;
}

export default function LeaderboardCards({
  users,
  loading,
  search,
  firstBlood,
  onSelect,
  onJoin,
}: Props) {
  if (loading) return <SkeletonCards count={6} />;

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          icon={Trophy}
          title={search ? "No results found" : "No coders yet"}
          description={
            search
              ? "Try a different search"
              : "Be the first to join the leaderboard!"
          }
          action={!search ? <Button onClick={onJoin}>Join Now</Button> : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, i) => {
        const rank = i + 1;
        return (
          <motion.button
            key={user.username}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: Math.min(i, 15) * 0.02 }}
            onClick={() => onSelect(user, rank)}
            className={`focus-ring relative block w-full overflow-hidden rounded-2xl border bg-surface/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40 ${rank <= 3 ? "border-white/15" : "border-border"}`}
          >
            {rank <= 3 && <span className={`absolute inset-y-0 left-0 w-[3px] ${rank === 1 ? "bg-gold" : rank === 2 ? "bg-silver" : "bg-bronze"}`} />}
            <div className="flex items-center gap-3">
              <span className="w-9 shrink-0">
                <RankLabel rank={rank} />
              </span>
              <Avatar user={user} size={36} rank={rank} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-mono text-sm font-medium text-fg">
                    {user.username}
                  </span>
                  {firstBlood === user.username && (
                    <span
                      title="First Blood (Question of the Week)"
                      className="shrink-0 text-accent"
                    >
                      <Droplet size={12} />
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-fg-muted">
                  {user.realName && user.realName !== user.username
                    ? user.realName
                    : `#${user.ranking?.toLocaleString() ?? "—"} global`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-lg font-semibold tabular-nums text-fg">
                  {user.totalSolved}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-fg-muted">
                  solved
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
              <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                <span className="text-easy">{user.easySolved}</span>
                <span className="text-fg-muted/40">·</span>
                <span className="text-medium">{user.mediumSolved}</span>
                <span className="text-fg-muted/40">·</span>
                <span className="text-hard">{user.hardSolved}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                {user.contestRating > 0 && (
                  <span className="font-mono tabular-nums">
                    ★ {user.contestRating}
                  </span>
                )}
                {user.yearStudying && (
                  <span className="rounded-full border border-border bg-surface-raised px-2 py-0.5 font-mono text-[10px]">
                    {user.yearStudying}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
