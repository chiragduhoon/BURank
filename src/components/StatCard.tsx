"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.textContent = target.toLocaleString();
      return;
    }
    const controls = animate(0, target, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = Math.round(v).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [target, reduced]);

  return <span ref={ref}>{target.toLocaleString()}</span>;
}

export default function StatCard({ label, value, sub, icon: Icon }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface/75 p-4 transition-all hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface-raised sm:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium text-fg-muted">{label}</p>
        {Icon && <Icon size={15} className="text-fg-muted/70 transition-colors group-hover:text-accent" />}
      </div>
      <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-fg">
        {typeof value === "number" ? <CountUp target={value} /> : value}
      </p>
      {sub && <p className="mt-1 text-xs text-fg-muted">{sub}</p>}
    </div>
  );
}
