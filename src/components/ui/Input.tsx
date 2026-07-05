"use client";

import { forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { invalid = false, className = "", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-lg border bg-bg/70 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-muted/60 outline-none transition-all focus:border-accent/70 focus:bg-surface focus:ring-2 focus:ring-accent/15 disabled:opacity-50 ${
        invalid ? "border-hard" : "border-border hover:border-border-strong"
      } ${className}`}
      {...rest}
    />
  );
});

export default Input;
