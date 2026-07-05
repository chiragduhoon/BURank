"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Crown, Swords, TrendingUp } from "lucide-react";
import { LeetCodeUser } from "@/types";
import { Avatar } from "./LeaderboardTable";

export type PodiumMetric = "solved" | "contest";

interface Props {
  users: LeetCodeUser[];
  metric: PodiumMetric;
  onSelect: (user: LeetCodeUser, rank: number) => void;
}

const ORDER = [1, 0, 2];
const STYLES = [
  "border-gold/45 bg-gold/[0.07] shadow-[0_0_38px_rgb(var(--gold)/0.08)] md:min-h-[210px]",
  "border-silver/30 bg-silver/[0.04] md:min-h-[176px]",
  "border-bronze/35 bg-bronze/[0.05] md:min-h-[166px]",
];

const HEADERS: Record<
  PodiumMetric,
  { eyebrow: string; title: string; tag: string }
> = {
  solved: {
    eyebrow: "Current podium",
    title: "Front runners",
    tag: "ranked by solves",
  },
  contest: {
    eyebrow: "Contest podium",
    title: "Contest warriors",
    tag: "ranked by rating",
  },
};

export default function TopPodium({ users, metric, onSelect }: Props) {
  const reduced = useReducedMotion();
  const top = users.slice(0, 3);
  if (top.length === 0) return null;

  const header = HEADERS[metric];
  const TagIcon = metric === "contest" ? Swords : TrendingUp;

  return (
    <section aria-label={header.title} className="mb-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{header.eyebrow}</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-fg">{header.title}</h2>
        </div>
        <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted sm:flex">
          <TagIcon size={13} className="text-accent" /> {header.tag}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 md:items-end">
        {ORDER.map((userIndex, visualIndex) => {
          const user = top[userIndex];
          const rank = userIndex + 1;
          if (!user) {
            return (
              <div
                key={`empty-${rank}`}
                className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border p-5 text-center opacity-70 ${STYLES[userIndex]}`}
              >
                <div className="absolute -right-8 -top-10 font-mono text-[118px] font-black leading-none text-white/[0.025]">{rank}</div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">Rank 0{rank}</p>
                <p className="mt-2 text-sm font-semibold text-fg-secondary">Unclaimed</p>
                <p className="mt-1 text-xs text-fg-muted">
                  {metric === "contest"
                    ? "Attend a contest to take this spot"
                    : "Join the board to take this spot"}
                </p>
              </div>
            );
          }
          return (
            <motion.button
              key={user.username}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: visualIndex * 0.07, duration: 0.35 }}
              onClick={() => onSelect(user, rank)}
              className={`focus-ring group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 hover:border-accent/50 ${STYLES[userIndex]}`}
            >
              <div className="absolute -right-8 -top-10 font-mono text-[118px] font-black leading-none text-white/[0.025]">{rank}</div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar user={user} size={rank === 1 ? 52 : 44} rank={rank} />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">Rank 0{rank}</p>
                    <p className="max-w-[150px] truncate font-mono text-sm font-bold text-fg">{user.username}</p>
                  </div>
                </div>
                {rank === 1 && <Crown size={18} className="text-gold drop-shadow-[0_0_8px_rgb(var(--gold)/0.5)]" />}
              </div>
              <div className="relative mt-6 flex items-end justify-between border-t border-white/[0.06] pt-4">
                {metric === "solved" ? (
                  <>
                    <div>
                      <p className="font-mono text-3xl font-black tabular-nums tracking-[-0.06em] text-fg">{user.totalSolved.toLocaleString()}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">problems solved</p>
                    </div>
                    <div className="text-right font-mono text-[11px]">
                      <span className="text-easy">{user.easySolved}</span>
                      <span className="mx-1 text-fg-muted/40">/</span>
                      <span className="text-medium">{user.mediumSolved}</span>
                      <span className="mx-1 text-fg-muted/40">/</span>
                      <span className="text-hard">{user.hardSolved}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="font-mono text-3xl font-black tabular-nums tracking-[-0.06em] text-fg">{user.contestRating.toLocaleString()}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">contest rating</p>
                    </div>
                    <div className="text-right font-mono text-[11px] text-fg-muted">
                      {user.attendedContestsCount} contest{user.attendedContestsCount === 1 ? "" : "s"}
                      {user.contestGlobalRanking > 0 && (
                        <>
                          <br />
                          <span className="text-fg-secondary">#{user.contestGlobalRanking.toLocaleString()} global</span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
