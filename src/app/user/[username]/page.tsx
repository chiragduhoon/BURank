import { fetchLeetCodeUser, fetchLeetCodeCalendar } from "@/lib/leetcode";
import { fetchUsernamesFromSheet } from "@/lib/sheets";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Heatmap from "@/components/Heatmap";
import Navbar from "@/components/Navbar";

interface Props {
  params: { username: string };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = params;

  // Fetch all required data
  const [user, calendar, sheetUsers] = await Promise.all([
    fetchLeetCodeUser(username),
    fetchLeetCodeCalendar(username),
    fetchUsernamesFromSheet(),
  ]);

  if (!user) {
    notFound();
  }

  // Find their year of studying from the sheet
  const sheetEntry = sheetUsers.find((u) => u.username === user.username);
  const yearStudying = sheetEntry?.yearStudying || "Not specified";

  const difficulties = [
    { label: "Easy", solved: user.easySolved, color: "bg-easy", text: "text-easy" },
    { label: "Medium", solved: user.mediumSolved, color: "bg-medium", text: "text-medium" },
    { label: "Hard", solved: user.hardSolved, color: "bg-hard", text: "text-hard" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="arena-grid min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl animate-slide-up px-4 py-6 sm:px-6 lg:py-10">
      <div className="rounded-3xl border border-border bg-bg/70 p-4 shadow-2xl shadow-black/40 sm:p-6 lg:p-8">
        <Link
          href="/"
          className="focus-ring mb-8 inline-flex items-center gap-1.5 rounded text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} />
          Back to Leaderboard
        </Link>

        {/* Profile Header Card */}
        <div className="relative mb-6 flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 sm:p-8 md:flex-row">
          <div aria-hidden className="absolute -right-20 -top-28 size-72 rounded-full bg-accent-solid/10 blur-3xl" />
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={88}
              height={88}
              className="rounded-full border border-border"
              unoptimized
            />
          ) : (
            <div className="flex size-[88px] items-center justify-center rounded-full border border-border bg-accent-solid text-3xl font-bold text-white">
              {user.username[0]?.toUpperCase()}
            </div>
          )}

          <div className="relative flex-1 text-center md:text-left">
            <p className="eyebrow mb-2">Coder profile // performance file</p>
            <h1 className="text-2xl font-semibold tracking-tight text-fg">
              {user.realName}
            </h1>
            <a
              href={`https://leetcode.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded font-mono text-sm text-fg-muted hover:text-fg hover:underline"
            >
              @{user.username}
              <ExternalLink size={12} className="opacity-50" />
            </a>

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="rounded-full border border-accent/30 bg-accent-solid/10 px-3 py-1 text-xs font-medium text-accent">
                Global Rank #{user.ranking?.toLocaleString() || "—"}
              </span>
              {yearStudying && yearStudying !== "Not specified" && (
                <span className="rounded-full border border-border bg-surface-raised px-3 py-1 font-mono text-xs font-medium text-fg-secondary">
                  Batch {yearStudying}
                </span>
              )}
            </div>
          </div>

          <div className="relative flex flex-row gap-8 text-center md:flex-col md:gap-4 md:text-right">
            <div>
              <p className="text-xs font-medium text-fg-muted">
                Contest Rating
              </p>
              <p className="font-mono text-xl font-semibold tabular-nums text-fg">
                {user.contestRating > 0 ? user.contestRating : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-fg-muted">
                Contests Attended
              </p>
              <p className="font-mono text-xl font-semibold tabular-nums text-fg">
                {user.attendedContestsCount}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent-solid/[0.06] p-6 md:items-start">
            <p className="mb-1 text-xs font-medium text-fg-muted">
              Total Solved
            </p>
            <p className="font-mono text-4xl font-semibold tabular-nums text-fg">
              {user.totalSolved}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface/70 p-6 md:col-span-3">
            <p className="mb-4 text-xs font-medium text-fg-muted">
              Difficulty Breakdown
            </p>
            <div className="flex w-full flex-col gap-3">
              {difficulties.map(({ label, solved, color, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={`w-16 text-sm font-medium ${text}`}>
                    {label}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
                      style={{
                        width: `${Math.max(2, (solved / Math.max(1, user.totalSolved)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-sm tabular-nums text-fg">
                    {solved}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap Card */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-fg">
              Submission Calendar
            </h2>
            <p className="font-mono text-xs text-fg-muted">Past 12 Months</p>
          </div>
          <div className="min-w-[700px]">
            {calendar ? (
              <Heatmap data={calendar} />
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-fg-muted">
                No activity data available.
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
