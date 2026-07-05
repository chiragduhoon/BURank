function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-border ${className}`} />
  );
}

// Shown while the server component fetches LeetCode data.
export default function Loading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar placeholder */}
      <div className="h-14 border-b border-border bg-surface" />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="rounded-2xl border border-border bg-surface-raised p-4 shadow-xl sm:p-6 lg:p-8">
        <Bar className="mb-8 h-4 w-40" />

        {/* Profile header skeleton */}
        <div className="mb-6 flex flex-col items-center gap-6 rounded-lg border border-border bg-surface p-6 sm:p-8 md:flex-row">
          <Bar className="size-[88px] shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col items-center gap-2.5 md:items-start">
            <Bar className="h-6 w-48" />
            <Bar className="h-4 w-32" />
            <div className="mt-2 flex gap-2">
              <Bar className="h-6 w-28 rounded-full" />
              <Bar className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex flex-row gap-8 md:flex-col md:gap-4">
            <Bar className="h-10 w-20" />
            <Bar className="h-10 w-20" />
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <Bar className="mb-3 h-3 w-20" />
            <Bar className="h-9 w-16" />
          </div>
          <div className="rounded-lg border border-border bg-surface p-6 md:col-span-3">
            <Bar className="mb-4 h-3 w-32" />
            <div className="space-y-3">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Heatmap skeleton */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <Bar className="h-5 w-44" />
            <Bar className="h-3 w-24" />
          </div>
          <Bar className="h-32 w-full" />
        </div>
      </div>
      </div>
    </div>
  );
}
