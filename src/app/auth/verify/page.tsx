// NextAuth redirects here after sending the magic link.
// Simple static page — just tells the user to check their email.

import { ArrowLeft, MailCheck } from "lucide-react";
import Wordmark from "@/components/ui/Wordmark";

export default function VerifyPage() {
  return (
    <div className="arena-grid flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-sm animate-slide-up overflow-hidden rounded-2xl border border-border-strong bg-surface/90 p-7 text-center shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="mb-6">
          <Wordmark size="lg" />
        </div>

        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-easy/30 bg-easy/10">
          <MailCheck size={24} className="text-easy" />
        </div>

        <h1 className="mb-2 text-lg font-semibold tracking-tight text-fg">
          Check your inbox
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-fg-muted">
          A sign-in link has been sent to your email address.
          <br />
          Open your inbox and click the link to complete sign-in.
        </p>

        <div className="rounded-lg border border-border bg-surface-raised px-4 py-3 text-left text-xs leading-relaxed text-fg-muted">
          <strong className="font-medium text-fg-secondary">
            Didn&apos;t receive it?
          </strong>
          <br />
          · Check your Junk / Spam folder
          <br />
          · The link expires in 15 minutes
          <br />· Go back and try again if needed
        </div>

        <a
          href="/auth/signin"
          className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded text-sm text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </a>
      </div>
    </div>
  );
}
