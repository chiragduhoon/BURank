"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Modal, { ModalCloseButton } from "./ui/Modal";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { validateEnrollment, FRESHER_BATCH } from "@/lib/enrollment";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

export default function AddUserModal({ onClose, onSuccess }: Props) {
  const [username, setUsername] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [yearStudying, setYearStudying] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    const trimmedEnrollment = enrollmentNo.trim().toUpperCase();

    if (!trimmedUser) {
      setStatus("error");
      setMessage("Please enter your LeetCode username.");
      return;
    }

    if (!yearStudying) {
      setStatus("error");
      setMessage("Please select your year of study.");
      return;
    }

    const isFresher = yearStudying === FRESHER_BATCH;

    if (!trimmedEnrollment && !isFresher) {
      setStatus("error");
      setMessage("Please enter your Enrollment Number.");
      return;
    }

    if (trimmedEnrollment) {
      const enrollmentCheck = validateEnrollment(trimmedEnrollment, yearStudying);
      if (!enrollmentCheck.ok) {
        setStatus("error");
        setMessage(enrollmentCheck.message);
        return;
      }
    }

    try {
      setStatus("loading");
      setMessage("");

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedUser,
          enrollmentNo: trimmedEnrollment,
          yearStudying,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.message || "Registration failed.");
        return;
      }

      setStatus("success");
      setMessage("Successfully joined the leaderboard!");

      onSuccess();

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);

      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const busy = status === "loading" || status === "success";

  return (
    <Modal onClose={onClose} label="Join Leaderboard" maxWidth="max-w-md">
      <div className="p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-fg">
              Join Leaderboard
            </h2>
            <p className="mt-0.5 text-sm text-fg-muted">
              Add your LeetCode profile to the board.
            </p>
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-fg-secondary">
              LeetCode Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setStatus("idle");
                setMessage("");
              }}
              placeholder="your_leetcode_username"
              disabled={busy}
              className="font-mono"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-fg-secondary">
              Enrollment Number
              {yearStudying === FRESHER_BATCH && (
                <span className="ml-1.5 text-xs font-normal text-fg-muted">
                  (optional for freshers)
                </span>
              )}
            </label>
            <Input
              type="text"
              value={enrollmentNo}
              onChange={(e) => {
                setEnrollmentNo(e.target.value.toUpperCase());
                setStatus("idle");
                setMessage("");
              }}
              placeholder="E24CSEU0000"
              disabled={busy}
              className="font-mono uppercase"
            />
            <p className="mt-1.5 text-xs text-fg-muted">
              {yearStudying === FRESHER_BATCH
                ? "Not issued yet? Leave this empty — you can join without it."
                : "Your Bennett enrollment ID, e.g. E24CSEU0001 or A24ARIU0010"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-fg-secondary">
              Year Studying
            </label>
            <select
              value={yearStudying}
              onChange={(e) => {
                setYearStudying(e.target.value);
                setStatus("idle");
                setMessage("");
              }}
              disabled={busy}
              className="w-full rounded-md border border-border bg-surface-raised px-3.5 py-2.5 text-sm text-fg outline-none transition-colors hover:border-border-strong focus:border-accent/60 focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
            >
              <option value="">Select your year</option>
              <option value="26-30">First Year / Freshers (26-30)</option>
              <option value="25-29">Second Year (25-29)</option>
              <option value="24-28">Third Year (24-28)</option>
              <option value="23-27">Fourth Year (23-27)</option>
            </select>
          </div>

          {message && (
            <p
              className={`text-sm ${
                status === "success"
                  ? "text-easy"
                  : status === "error"
                    ? "text-hard"
                    : "text-fg-muted"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              !username.trim() ||
              (!enrollmentNo.trim() && yearStudying !== FRESHER_BATCH) ||
              !yearStudying ||
              busy
            }
            className={`w-full ${status === "success" ? "bg-easy hover:bg-easy" : ""}`}
          >
            {status === "loading" ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Joining…
              </>
            ) : status === "success" ? (
              <>
                <Check size={15} />
                Joined!
              </>
            ) : (
              "Join Leaderboard"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-fg-muted">
          Your LeetCode username will be verified before being added to the
          leaderboard.
        </p>
      </div>
    </Modal>
  );
}
