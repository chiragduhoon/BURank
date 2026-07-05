"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Wordmark from "@/components/ui/Wordmark";
import { LeetCodeUser } from "@/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dashboard state
  const [users, setUsers] = useState<LeetCodeUser[]>([]);
  const [qotw, setQotw] = useState("");
  const [qotwLoading, setQotwLoading] = useState(false);
  const [qotwSuccess, setQotwSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        fetchDashboardData();
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [usersRes, qotwRes] = await Promise.all([
        fetch("/api/leaderboard"),
        fetch("/api/qotw"),
      ]);
      const usersData = await usersRes.json();
      const qotwData = await qotwRes.json();

      setUsers(usersData.users || []);
      setQotw(qotwData.qotw_url || "");
    } catch (err) {
      console.error("Failed to fetch dashboard data");
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}?`)) return;

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", username }),
      });
      const data = await res.json();
      console.log("Delete response:", data);
      if (data.success) {
        setUsers(users.filter((u) => u.username !== username));
      } else {
        alert(data.message || "Failed to delete user. Check console for details.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error while deleting user");
    }
  };

  const handleClearNote = async (username: string) => {
    if (!confirm(`Clear ${username}'s note?`)) return;

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_note", username }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to clear note.");
      }
    } catch (err) {
      console.error("Clear note error:", err);
      alert("Network error while clearing note");
    }
  };

  const handleSetQotw = async (e: React.FormEvent) => {
    e.preventDefault();
    setQotwLoading(true);
    setQotwSuccess("");

    try {
      const res = await fetch("/api/admin/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_qotw", qotw_url: qotw }),
      });
      const data = await res.json();
      if (data.success) {
        setQotwSuccess("Question of the day updated successfully!");
        setTimeout(() => setQotwSuccess(""), 3000);
      } else {
        alert("Failed to set QOTW");
      }
    } catch {
      alert("Network error");
    } finally {
      setQotwLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="arena-grid flex min-h-screen items-center justify-center bg-bg p-4">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="overflow-hidden rounded-2xl border border-border-strong bg-surface/90 shadow-2xl shadow-black/60">
            <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            <div className="p-7 pb-8">
              <div className="mb-6 text-center">
                <Wordmark size="lg" />
              </div>
              <h1 className="text-base font-semibold text-fg">Admin Login</h1>
              <p className="mb-6 mt-1 text-sm text-fg-muted">
                Enter password to access dashboard
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  invalid={!!error}
                  autoFocus
                />

                {error && <p className="text-xs text-hard">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="focus-ring inline-flex items-center gap-1.5 rounded text-xs text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft size={12} />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-grid min-h-screen bg-bg p-4 sm:p-8">
      <div className="mx-auto max-w-4xl animate-fade-in rounded-3xl border border-border bg-bg/70 p-4 shadow-2xl shadow-black/50 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-fg">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-fg-muted">
              Manage users and settings
            </p>
          </div>
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-fg-secondary transition-colors hover:border-border-strong hover:text-fg"
          >
            View Site
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Question of the Day Panel */}
        <div className="mb-6 rounded-lg border border-border bg-surface p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold tracking-tight text-fg">
            Question of the Day
          </h2>
          <p className="mb-4 text-sm text-fg-muted">
            Auto-set to LeetCode&apos;s Daily Challenge every day. Paste a URL
            below only to override today&apos;s question manually.
          </p>
          <form
            onSubmit={handleSetQotw}
            className="flex flex-col items-start gap-3 sm:flex-row"
          >
            <div className="w-full flex-1">
              <Input
                type="text"
                value={qotw}
                onChange={(e) => setQotw(e.target.value)}
                placeholder="Paste LeetCode URL (e.g. https://leetcode.com/problems/two-sum)"
              />
              {qotwSuccess && (
                <p className="mt-2 text-sm font-medium text-easy">
                  {qotwSuccess}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={qotwLoading}
              className="w-full whitespace-nowrap sm:w-auto"
            >
              {qotwLoading ? "Saving…" : "Set Question"}
            </Button>
          </form>
        </div>

        {/* User Management Panel */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border bg-surface-raised/50 px-6 py-4">
            <h2 className="text-base font-semibold tracking-tight text-fg">
              Registered Users ({users.length})
            </h2>
            <Button variant="ghost" onClick={fetchDashboardData}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-header text-left text-xs uppercase tracking-wide text-header-fg">
                  <th className="px-6 py-3 font-medium">Username</th>
                  <th className="px-6 py-3 font-medium">Enrollment</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-fg-muted"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.username}
                      className="border-b border-border transition-colors last:border-0 odd:bg-surface even:bg-surface-raised hover:bg-accent-solid/[0.06]"
                    >
                      <td className="px-6 py-3">
                        <a
                          href={`https://leetcode.com/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-fg hover:underline"
                        >
                          {user.username}
                        </a>
                      </td>
                      <td className="px-6 py-3 font-mono text-fg-muted">
                        {user.enrollmentNo || "—"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleClearNote(user.username)}
                          className="focus-ring mr-1 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:bg-surface-raised hover:text-fg"
                        >
                          Clear note
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.username)}
                          className="focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-hard transition-colors hover:bg-hard/10"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
