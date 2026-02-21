export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-[#222] rounded w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-[#222] rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'} ${i > 0 ? 'mt-2' : ''}`} />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse">
      <div className="h-8 bg-[#222] rounded w-16 mb-2" />
      <div className="h-3 bg-[#222] rounded w-20" />
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#111] border border-[#222] rounded p-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#222]" />
            <div className="flex-1">
              <div className="h-3 bg-[#222] rounded w-3/4 mb-2" />
              <div className="h-2 bg-[#222] rounded w-1/2" />
            </div>
            <div className="h-4 bg-[#222] rounded w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
