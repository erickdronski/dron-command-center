import { Loader2, Play, AlertCircle } from 'lucide-react';

export function ActionCenterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-500/20 rounded"></div>
          <div className="h-8 w-40 bg-[#222] rounded"></div>
        </div>
        <div className="h-10 w-32 bg-purple-500/20 rounded"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#111] border border-[#222] rounded-lg p-4">
            <div className="h-8 w-12 bg-[#222] rounded mb-2"></div>
            <div className="h-4 w-20 bg-[#1a1a1a] rounded"></div>
          </div>
        ))}
      </div>

      {/* Kanban Skeleton */}
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(col => (
          <div key={col} className="space-y-3">
            <div className="h-6 w-24 bg-[#222] rounded"></div>
            {[1, 2].map(card => (
              <div key={card} className="bg-[#111] border border-[#222] rounded-lg p-4">
                <div className="h-5 w-full bg-[#1a1a1a] rounded mb-2"></div>
                <div className="h-4 w-24 bg-[#1a1a1a] rounded"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
