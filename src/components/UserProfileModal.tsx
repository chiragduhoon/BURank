"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ExternalLink, FileCode2, Link2, MessageSquareQuote } from "lucide-react";
import { LeetCodeUser } from "@/types";
import { computeBadges, getNextBadgeProgress } from "@/lib/badges";
import { NOTE_MAX_LENGTH, validateNote } from "@/lib/note";
import BadgeList from "./BadgeList";
import Modal, { ModalCloseButton } from "./ui/Modal";
import Button from "./ui/Button";

interface Props {
  user: LeetCodeUser;
  collegeRank: number;
  isOwnProfile?: boolean;
  onNoteSaved?: () => void;
  onClose: () => void;
}

const Stat = ({
  label,
  value,
  valueClass = "text-fg",
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) => (
  <div className="rounded-md border border-border bg-surface-raised px-3.5 py-2.5">
    <p className="mb-1 text-[11px] uppercase tracking-wider text-fg-muted">
      {label}
    </p>
    <p className={`font-mono text-xl font-semibold tabular-nums ${valueClass}`}>
      {value}
    </p>
  </div>
);

export default function UserProfileModal({
  user,
  collegeRank,
  isOwnProfile = false,
  onNoteSaved,
  onClose,
}: Props) {
  const badges = computeBadges(user);
  const nextBadge = getNextBadgeProgress(user);
  const [copied, setCopied] = useState<"card" | "readme" | null>(null);

  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(user.note ?? "");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [savedNote, setSavedNote] = useState(user.note ?? "");

  const saveNote = async () => {
    const check = validateNote(noteDraft);
    if (!check.ok) {
      setNoteError(check.message);
      return;
    }
    setNoteSaving(true);
    setNoteError("");
    try {
      const res = await fetch("/api/me/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: check.note }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setNoteError(data.message || "Failed to save note.");
        return;
      }
      setSavedNote(data.note);
      setEditingNote(false);
      onNoteSaved?.();
    } catch {
      setNoteError("Something went wrong. Try again.");
    } finally {
      setNoteSaving(false);
    }
  };

  const copyGithubMarkdown = async () => {
    if (!user.enrollmentNo) return;
    const markdown = `![My BURank Rank](${window.location.origin}/card/${user.enrollmentNo})`;
    await navigator.clipboard.writeText(markdown);
    setCopied("readme");
    setTimeout(() => setCopied(null), 2000);
  };

  const copyRankCard = async () => {
    if (!user.enrollmentNo) {
      console.warn("Enrollment number not available.");
      return;
    }
    const url = `${window.location.origin}/card/${user.enrollmentNo}`;
    await navigator.clipboard.writeText(url);
    setCopied("card");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Modal onClose={onClose} label={`${user.username}'s profile`} accentBar>
      {/* Header */}
      <div className="border-b border-border px-6 pb-4 pt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={48}
                height={48}
                className="shrink-0 rounded-full"
                unoptimized
              />
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-solid text-lg font-bold text-white">
                {user.username[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <a
                href={`https://leetcode.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded font-mono text-base font-semibold text-fg hover:underline"
              >
                <span className="truncate">{user.username}</span>
                <ExternalLink size={12} className="shrink-0 opacity-50" />
              </a>
              {user.realName && user.realName !== user.username && (
                <p className="truncate text-sm text-fg-muted">
                  {user.realName}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">
                College rank
              </p>
              <p className="font-mono text-xl font-semibold tabular-nums text-accent">
                #{collegeRank}
              </p>
            </div>
            <ModalCloseButton onClose={onClose} />
          </div>
        </div>
      </div>

      {/* Note */}
      {(savedNote || isOwnProfile) && (
        <div className="border-b border-border px-6 py-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-fg-muted">
              <MessageSquareQuote size={12} />
              Note
            </p>
            {isOwnProfile && !editingNote && (
              <button
                onClick={() => {
                  setNoteDraft(savedNote);
                  setEditingNote(true);
                }}
                className="focus-ring rounded text-xs font-medium text-accent hover:underline"
              >
                {savedNote ? "Edit" : "Add a note"}
              </button>
            )}
          </div>
          {editingNote ? (
            <div>
              <textarea
                value={noteDraft}
                onChange={(e) => {
                  setNoteDraft(e.target.value);
                  setNoteError("");
                }}
                maxLength={NOTE_MAX_LENGTH}
                rows={3}
                autoFocus
                placeholder="Trash talk, goals, whatever — 250 characters, keep it clean, no links."
                className="w-full resize-none rounded-md border border-border bg-surface-raised px-3 py-2.5 text-sm text-fg outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
              />
              <div className="mt-1.5 flex items-center justify-between">
                <p className={`text-xs ${noteError ? "text-hard" : "text-fg-muted"}`}>
                  {noteError || `${noteDraft.trim().length}/${NOTE_MAX_LENGTH}`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNote(false);
                      setNoteError("");
                    }}
                    className="focus-ring rounded px-2 py-1 text-xs text-fg-muted hover:text-fg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={noteSaving}
                    className="focus-ring rounded bg-accent-solid px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50"
                  >
                    {noteSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          ) : savedNote ? (
            <p className="text-sm leading-relaxed text-fg-secondary">
              &ldquo;{savedNote}&rdquo;
            </p>
          ) : (
            <p className="text-sm italic text-fg-muted">
              No note yet — add some trash talk.
            </p>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="space-y-2 border-b border-border px-6 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Total solved" value={user.totalSolved} />
          <Stat
            label="Global rank"
            value={`#${user.ranking?.toLocaleString()}`}
          />
          <Stat
            label="Contest rating"
            value={user.contestRating > 0 ? user.contestRating : "—"}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Easy" value={user.easySolved} valueClass="text-easy" />
          <Stat
            label="Medium"
            value={user.mediumSolved}
            valueClass="text-medium"
          />
          <Stat label="Hard" value={user.hardSolved} valueClass="text-hard" />
        </div>
      </div>

      {/* Next badge progress */}
      {nextBadge && (
        <div className="border-b border-border px-6 py-4">
          <p className="mb-2.5 text-[11px] uppercase tracking-wider text-fg-muted">
            Next Badge
          </p>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-fg">{nextBadge.label}</span>
            <span className="font-mono tabular-nums text-fg-muted">
              {nextBadge.current} / {nextBadge.target}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${nextBadge.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="h-full rounded-full bg-accent-solid"
            />
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            {nextBadge.remaining} more {nextBadge.unit} to unlock{" "}
            <strong className="font-medium text-fg">{nextBadge.label}</strong>
          </p>
        </div>
      )}

      {/* Actions + badges */}
      <div className="px-6 pb-6 pt-4">
        <div className="mb-5 space-y-2">
          <Button onClick={copyRankCard} className="w-full">
            {copied === "card" ? (
              <>
                <Check size={15} />
                Copied!
              </>
            ) : (
              <>
                <Link2 size={15} />
                Copy Rank Card Link
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={copyGithubMarkdown}
            className="w-full"
          >
            {copied === "readme" ? (
              <>
                <Check size={15} />
                Copied!
              </>
            ) : (
              <>
                <FileCode2 size={15} />
                Copy GitHub README
              </>
            )}
          </Button>
        </div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-fg-muted">
          Badges · {badges.length} earned
        </p>
        <BadgeList badges={badges} variant="full" />
      </div>
    </Modal>
  );
}
