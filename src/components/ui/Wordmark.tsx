import Link from "next/link";

interface Props {
  size?: "sm" | "lg";
  asLink?: boolean;
}

export default function Wordmark({ size = "sm", asLink = true }: Props) {
  const mark = (
    <span
      className={`inline-flex items-center gap-2 font-mono font-bold tracking-[-0.06em] text-fg ${
        size === "lg" ? "text-2xl" : "text-base"
      }`}
    >
      <span className="relative flex size-6 items-center justify-center overflow-hidden rounded-md border border-accent/40 bg-accent-solid text-[9px] tracking-normal text-white shadow-[0_0_18px_rgb(var(--accent-solid)/0.25)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/50">BU</span>
      <span>BU<span className="text-accent">RANK</span></span>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link href="/" className="focus-ring rounded-md">
      {mark}
    </Link>
  );
}
