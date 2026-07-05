function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-border ${className}`} />
  );
}

export default function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-border last:border-0">
          <td className="px-6 py-4">
            <Bar className="h-5 w-6" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Bar className="h-8 w-8 rounded-full" />
              <Bar className="h-4 w-32" />
            </div>
          </td>
          <td className="px-6 py-4">
            <Bar className="h-4 w-16" />
          </td>
          <td className="px-6 py-4">
            <Bar className="h-4 w-16" />
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-3">
              <Bar className="h-4 w-8" />
              <Bar className="h-4 w-8" />
              <Bar className="h-4 w-8" />
            </div>
          </td>
          <td className="px-6 py-4">
            <Bar className="h-4 w-16" />
          </td>
          <td className="px-6 py-4">
            <Bar className="h-4 w-20" />
          </td>
          <td className="px-6 py-4">
            <Bar className="h-4 w-24" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className="flex items-center gap-3">
            <Bar className="h-5 w-8" />
            <Bar className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Bar className="h-4 w-28" />
              <Bar className="h-3 w-20" />
            </div>
            <Bar className="h-7 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCards() {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <Bar className="mb-3 h-3 w-16" />
          <Bar className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
