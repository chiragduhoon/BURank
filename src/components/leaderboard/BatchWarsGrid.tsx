"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Swords } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export interface BatchData {
  year: string;
  totalStudents: number;
  totalSolved: number;
  avgSolved: number;
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
}

interface Props {
  batchStats: BatchData[];
}

function RankChip({ idx }: { idx: number }) {
  if (idx === 0)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
        <Crown size={12} />
        Leading
      </span>
    );
  if (idx === 1)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-silver/30 bg-silver/10 px-2.5 py-1 text-xs font-medium text-silver">
        <Medal size={12} />
        #2
      </span>
    );
  if (idx === 2)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-2.5 py-1 text-xs font-medium text-bronze">
        <Medal size={12} />
        #3
      </span>
    );
  return null;
}

export default function BatchWarsGrid({ batchStats }: Props) {
  if (batchStats.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <EmptyState
          icon={Swords}
          title="No batch data available yet"
          description="Batches appear once coders join the leaderboard."
        />
      </div>
    );
  }

  const leaderAvg = batchStats[0]?.avgSolved || 1;

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {batchStats.map((batch, idx) => (
        <motion.div
          key={batch.year}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
          className={`group relative overflow-hidden rounded-2xl border bg-surface/70 p-5 transition-all hover:-translate-y-1 ${
            idx === 0
              ? "border-accent/50 shadow-[0_0_38px_rgb(var(--accent-solid)/0.1)] hover:border-accent/70"
              : "border-border hover:border-border-strong"
          }`}
        >
          <div className="absolute -right-4 -top-8 font-mono text-[100px] font-black leading-none text-white/[0.025]">{String(idx + 1).padStart(2, "0")}</div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="eyebrow mb-1">Combat unit {String(idx + 1).padStart(2, "0")}</p>
              <h3 className="text-lg font-bold tracking-tight text-fg">
                {batch.year === "Unknown"
                  ? "Unassigned"
                  : `Batch ${batch.year}`}
              </h3>
              <p className="mt-0.5 text-sm text-fg-muted">
                {batch.totalStudents} coders
              </p>
            </div>
            <RankChip idx={idx} />
          </div>

          <div className="border-b border-border/70 pb-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">Power score / average</p>
            <p className="mt-1 font-mono text-4xl font-black tabular-nums tracking-[-0.06em] text-fg">
              {batch.avgSolved.toLocaleString()}
              <span className="ml-1.5 font-sans text-sm font-normal text-fg-muted">
                / coder
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4">
            <div>
              <p className="text-xs font-medium text-easy">Easy</p>
              <p className="mt-0.5 font-mono text-sm tabular-nums text-fg">
                {batch.totalEasy.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-medium">Medium</p>
              <p className="mt-0.5 font-mono text-sm tabular-nums text-fg">
                {batch.totalMedium.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-hard">Hard</p>
              <p className="mt-0.5 font-mono text-sm tabular-nums text-fg">
                {batch.totalHard.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-bg">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.max(5, (batch.avgSolved / leaderAvg) * 100)}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className={`h-full rounded-full ${
                idx === 0 ? "bg-accent-solid shadow-[0_0_10px_rgb(var(--accent-solid)/0.7)]" : "bg-fg-muted/40"
              }`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
