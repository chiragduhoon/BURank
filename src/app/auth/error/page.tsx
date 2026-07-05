"use client";

// NextAuth redirects here when something goes wrong.
// The error type is passed as a query param: ?error=AccessDenied etc.

import { XCircle } from "lucide-react";
import Wordmark from "@/components/ui/Wordmark";

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Only @bennett.edu.in email addresses can sign in to BURank.",
  Verification:
    "This sign-in link has expired or has already been used. Please request a new one.",
  Configuration:
    "There is a server configuration issue. Please contact the admin.",
  Default: "Something went wrong during sign-in. Please try again.",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const errorCode = searchParams?.error ?? "Default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="arena-grid flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm animate-slide-up overflow-hidden rounded-2xl border border-border-strong bg-surface/90 p-7 text-center shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="mb-6">
          <Wordmark size="lg" />
        </div>

        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-hard/30 bg-hard/10">
          <XCircle size={24} className="text-hard" />
        </div>

        <h1 className="mb-2 text-lg font-semibold tracking-tight text-fg">
          Sign-in failed
        </h1>

        <p className="mb-7 text-sm leading-relaxed text-fg-muted">{message}</p>

        <a
          href="/auth/signin"
          className="focus-ring inline-flex items-center justify-center rounded-md bg-accent-solid px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
        >
          Try again
        </a>
      </div>
    </div>
  );
}
