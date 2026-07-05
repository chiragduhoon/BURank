"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import AddUserModal from "@/components/AddUserModal";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import UserProfileModal from "@/components/UserProfileModal";
import BatchWarsGrid, {
  BatchData,
} from "@/components/leaderboard/BatchWarsGrid";
import FilterBar, { Filter } from "@/components/leaderboard/FilterBar";
import LeaderboardCards from "@/components/leaderboard/LeaderboardCards";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import QotwBanner from "@/components/leaderboard/QotwBanner";
import ViewToggle, { ViewMode } from "@/components/leaderboard/ViewToggle";
import TopPodium from "@/components/leaderboard/TopPodium";
import Button from "@/components/ui/Button";
import { SkeletonStatCards } from "@/components/SkeletonRows";
import { LeetCodeUser, SortDirection, SortKey } from "@/types";
import { useSession } from "next-auth/react";

const COLLEGE = process.env.NEXT_PUBLIC_COLLEGE_NAME ?? "Bennett University";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeetCodeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("totalSolved");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [qotw, setQotw] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("individuals");
  const [firstBlood, setFirstBlood] = useState<string>("");
  const [viewer, setViewer] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useSession(); // keep session alive for the Navbar

  const isRegistered = viewer !== null;

  const [selectedUser, setSelectedUser] = useState<{
    user: LeetCodeUser;
    rank: number;
  } | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, qotwRes] = await Promise.all([
        fetch("/api/leaderboard", { cache: "no-store" }),
        fetch("/api/qotw", { cache: "no-store" }),
      ]);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const qotwData = await qotwRes.json();

      setUsers(data.users ?? []);
      setViewer(data.viewer ?? null);
      setQotw(qotwData.qotw_url || "");
      setFirstBlood(qotwData.first_blood || "");

      setLastRefreshed(new Date());
    } catch {
      setError("Could not load leaderboard. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // "/" focuses search, GitHub-style
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      )
        return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sort + filter logic
  const processed = useMemo(() => {
    let list = [...users].filter((u) => !u.error);

    if (filter === "top10") list = list.slice(0, 10);
    if (filter === "contested")
      list = list.filter((u) => u.attendedContestsCount > 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.realName.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      const mult = sortDir === "desc" ? -1 : 1;
      if (sortKey === "ranking") return mult * (a.ranking - b.ranking) * -1; // lower rank number = better
      if (sortKey === "yearStudying") {
        const aVal = a.yearStudying || "";
        const bVal = b.yearStudying || "";
        return mult * aVal.localeCompare(bVal);
      }
      return mult * ((a[sortKey] as number) - (b[sortKey] as number));
    });

    return list;
  }, [users, search, sortKey, sortDir, filter]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "ranking" ? "asc" : "desc");
    }
  };

  // Batch stats logic
  const batchStats = useMemo(() => {
    const batches: Record<string, BatchData> = {};

    users
      .filter((u) => !u.error)
      .forEach((u) => {
        const year = u.yearStudying || "Unknown";
        if (!batches[year]) {
          batches[year] = {
            year,
            totalStudents: 0,
            totalSolved: 0,
            avgSolved: 0,
            totalEasy: 0,
            totalMedium: 0,
            totalHard: 0,
          };
        }
        batches[year].totalStudents++;
        batches[year].totalSolved += u.totalSolved;
        batches[year].totalEasy += u.easySolved;
        batches[year].totalMedium += u.mediumSolved;
        batches[year].totalHard += u.hardSolved;
      });

    return Object.values(batches)
      .map((b) => {
        b.avgSolved = Math.round(b.totalSolved / b.totalStudents);
        return b;
      })
      .sort((a, b) => b.avgSolved - a.avgSolved);
  }, [users]);

  // Podium rankings — independent of the table's sort/search state
  const solvedTop = useMemo(
    () =>
      users
        .filter((u) => !u.error)
        .sort((a, b) => b.totalSolved - a.totalSolved),
    [users],
  );
  const contestTop = useMemo(
    () =>
      users
        .filter((u) => !u.error && u.contestRating > 0)
        .sort((a, b) => b.contestRating - a.contestRating),
    [users],
  );

  // Summary stats
  const activeUsers = users.filter((u) => !u.error);
  const totalSolvedAll = activeUsers.reduce((a, u) => a + u.totalSolved, 0);
  const topRating = Math.max(...activeUsers.map((u) => u.contestRating), 0);
  const avgSolved =
    activeUsers.length > 0
      ? Math.round(totalSolvedAll / activeUsers.length)
      : 0;

  const handleSelect = (user: LeetCodeUser, rank: number) =>
    setSelectedUser({ user, rank });
  const handleJoin = () => setShowModal(true);

  return (
    <div className="min-h-screen bg-bg">
      <Navbar isRegistered={isRegistered} onJoin={handleJoin} />

      <div className="arena-grid min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-border bg-bg/65 p-4 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-6 lg:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-48 size-[34rem] rounded-full bg-accent-solid/[0.07] blur-3xl" />
        {/* Header */}
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-surface/65 p-5 sm:p-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-solid)/0.09),transparent)]"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-2">Live coding arena // season 01</p>
              <h1 className="max-w-2xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.055em] text-fg sm:text-5xl">
                Code. Climb. <span className="text-accent">Conquer.</span>
              </h1>
              <p className="mt-3 text-sm font-medium text-fg-secondary">{COLLEGE} <span className="text-fg-muted">LeetCode rankings</span></p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm text-fg-muted">
                LeetCode Leaderboard · {activeUsers.length} coders registered
                {lastRefreshed && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-easy opacity-60" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-easy" />
                    </span>
                    Updated {lastRefreshed.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={fetchLeaderboard}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </header>

        <QotwBanner qotw={qotw} firstBlood={firstBlood} />

        {!loading && viewMode === "individuals" && (
          <>
            <TopPodium users={solvedTop} metric="solved" onSelect={handleSelect} />
            <TopPodium users={contestTop} metric="contest" onSelect={handleSelect} />
          </>
        )}

        {/* Summary stat cards */}
        {loading ? (
          <SkeletonStatCards />
        ) : (
          activeUsers.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="Coders"
                value={activeUsers.length}
                sub="on leaderboard"
                icon={Users}
              />
              <StatCard
                label="Problems Solved"
                value={totalSolvedAll}
                sub="combined"
                icon={CheckCircle2}
              />
              <StatCard
                label="Avg Solved"
                value={avgSolved}
                sub="per coder"
                icon={TrendingUp}
              />
              <StatCard
                label="Top Rating"
                value={topRating > 0 ? topRating : "—"}
                sub="contest rating"
                icon={Trophy}
              />
            </div>
          )
        )}

        {/* View toggle */}
        <div className="mb-6">
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === "individuals" ? (
          <>
            <FilterBar
              search={search}
              onSearch={setSearch}
              filter={filter}
              onFilter={setFilter}
              searchRef={searchRef}
            />

            {/* Error state */}
            {error && (
              <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-hard/30 bg-hard/10 px-5 py-4">
                <div className="flex items-center gap-3 text-sm text-hard">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
                <Button variant="secondary" onClick={fetchLeaderboard}>
                  Retry
                </Button>
              </div>
            )}

            {/* Desktop table */}
            <div className="hidden sm:block">
              <LeaderboardTable
                users={processed}
                totalCount={activeUsers.length}
                loading={loading}
                search={search}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                firstBlood={firstBlood}
                onSelect={handleSelect}
                onJoin={handleJoin}
              />
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden">
              <LeaderboardCards
                users={processed}
                loading={loading}
                search={search}
                firstBlood={firstBlood}
                onSelect={handleSelect}
                onJoin={handleJoin}
              />
            </div>

            {/* Failed users notice */}
            {users.some((u) => u.error) && (
              <p className="mt-4 text-center text-xs text-fg-muted">
                {users.filter((u) => u.error).length} username(s) could not be
                fetched and are hidden.
              </p>
            )}
          </>
        ) : (
          <BatchWarsGrid batchStats={batchStats} />
        )}
      </motion.div>
      </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddUserModal
            key="add-user"
            onClose={() => setShowModal(false)}
            onSuccess={fetchLeaderboard}
          />
        )}

        {selectedUser && (
          <UserProfileModal
            key="user-profile"
            user={selectedUser.user}
            collegeRank={selectedUser.rank}
            isOwnProfile={viewer === selectedUser.user.username}
            onNoteSaved={fetchLeaderboard}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
