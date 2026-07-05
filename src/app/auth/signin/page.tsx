"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Mail, MailCheck } from "lucide-react";
import Wordmark from "@/components/ui/Wordmark";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const callbackUrl = "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    setStatus("loading");
    setMessage("");

    // signIn("email") triggers NextAuth's EmailProvider
    // which calls our sendVerificationRequest → Resend
    const res = await signIn("email", {
      email: trimmed,
      redirect: false, // handle redirect ourselves
      callbackUrl,
    });

    if (res?.error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    // Success — NextAuth will redirect to /auth/verify
    setStatus("sent");

    // In local dev (no email service), the server exposes the magic link
    // directly so you can sign in without an inbox.
    try {
      const devRes = await fetch("/api/dev/magic-link");
      if (devRes.ok) {
        const data = await devRes.json();
        if (data?.url && data?.email === trimmed) setDevLink(data.url);
      }
    } catch {
      // production — endpoint doesn't exist, ignore
    }
  };

  return (
    <div className="arena-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-bg p-4">
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-solid/10 blur-3xl" />
      <div className="w-full max-w-sm animate-slide-up">
        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface/90 shadow-2xl shadow-black/60 backdrop-blur-xl">
          <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="p-7 pb-8">
            {/* Wordmark */}
            <div className="mb-6 text-center">
              <Wordmark size="lg" />
              <p className="mt-1.5 text-sm text-fg-muted">
                Bennett University · LeetCode Leaderboard
              </p>
            </div>

            <h1 className="text-base font-semibold text-fg">Sign in</h1>
            <p className="mb-6 mt-1 text-sm text-fg-muted">
              Enter your personal email to receive a sign-in link. No password
              needed.
            </p>

            {status === "sent" ? (
              /* ── Success state ── */
              <div className="py-4 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-easy/30 bg-easy/10">
                  <MailCheck size={20} className="text-easy" />
                </div>
                <p className="mb-2 text-sm font-semibold text-easy">
                  Check your inbox
                </p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  We sent a sign-in link to
                  <br />
                  <strong className="font-mono font-medium text-fg">
                    {email.trim().toLowerCase()}
                  </strong>
                  <br />
                  Open your inbox and click the link.
                </p>
                <p className="mt-4 text-xs text-fg-muted/70">
                  Link expires in 15 minutes · one-time use only
                </p>
                {devLink && (
                  <a
                    href={devLink}
                    className="mt-4 inline-block rounded-md border border-easy/40 bg-easy/10 px-4 py-2 text-sm font-semibold text-easy transition-colors hover:bg-easy/20"
                  >
                    Dev mode: open sign-in link →
                  </a>
                )}
              </div>
            ) : (
              /* ── Form state ── */
              <form onSubmit={handleSubmit}>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-fg-muted">
                  Personal Email
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus("idle");
                      setMessage("");
                    }}
                    placeholder="example@gmail.com"
                    disabled={status === "loading"}
                    autoFocus
                    invalid={status === "error"}
                    className="pl-10 font-mono"
                  />
                </div>

                {status === "error" && message ? (
                  <p className="mt-2 text-xs text-hard">{message}</p>
                ) : (
                  <p className="mt-2 text-xs text-fg-muted">
                    Do not use @bennett.edu.in
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={!email.trim() || status === "loading"}
                  className="mt-4 w-full"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send sign-in link"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-white/50">
          Only Bennett University students can sign in.
        </p>
      </div>
    </div>
  );
}
