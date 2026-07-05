"use client";

import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "border border-accent/50 bg-accent-solid text-white shadow-[0_0_24px_rgb(var(--accent-solid)/0.18)] hover:bg-accent-hover hover:shadow-[0_0_30px_rgb(var(--accent-solid)/0.28)] active:scale-[0.98]",
  secondary:
    "border border-border bg-surface-raised/80 text-fg-secondary hover:border-accent/40 hover:bg-surface-raised hover:text-fg",
  ghost: "text-fg-muted hover:text-fg hover:bg-white/5",
};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
