"use client";

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-[#222] rounded w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-[#222] rounded ${i === lines - 1 ? "w-2/3" : "w-full"} ${i > 0 ? "mt-2" : ""}`} />
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

export function SkeletonWeatherCard() {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-4 bg-[#222] rounded w-24 mb-2" />
          <div className="h-3 bg-[#222] rounded w-16" />
        </div>
        <div className="h-6 bg-[#222] rounded w-12" />
      </div>
      
      <div className="h-8 bg-[#222] rounded w-20 mb-3" />
      
      <div className="h-1.5 bg-[#222] rounded-full mb-3" />
      
      <div className="h-3 bg-[#222] rounded w-full mb-2" />
      <div className="flex gap-4">
        <div className="h-3 bg-[#222] rounded w-20" />
        <div className="h-3 bg-[#222] rounded w-16" />
      </div>
    </div>
  );
}

export function SkeletonFeedItem() {
  return (
    <div className="px-4 py-3 border-b border-[#1a1a1a] last:border-0 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-[#222] rounded w-16" />
        <div className="h-3 bg-[#222] rounded w-20" />
      </div>
      <div className="h-3 bg-[#222] rounded w-3/4" />
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

export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 bg-[#222] rounded w-48 animate-pulse" />
      
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse h-24" />
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
    </div>
  );
}
