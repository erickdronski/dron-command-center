'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ActivityEntry {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  agent: string;
}

export function ActivityFeed({ maxItems = 10 }: { maxItems?: number }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/live-feed');
        const data = await res.json();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const displayEntries = entries.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1a1a1a]">
          <span className="text-sm font-semibold text-[#555] uppercase tracking-wider">Recent Activity</span>
        </div>
        <div className="divide-y divide-[#1a1a1a]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 bg-[#222] rounded w-12" />
                <div className="h-3 bg-[#222] rounded w-20" />
              </div>
              <div className="h-3 bg-[#222] rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
        <span className="text-sm font-semibold text-[#555] uppercase tracking-wider">Recent Activity</span>
      </div>
      
      <div className="divide-y divide-[#1a1a1a] max-h-96 overflow-y-auto">
        {displayEntries.map((entry) => (
          <div key={entry.id} className="px-4 py-3 hover:bg-[#151515] transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    entry.type === 'FILE_EDIT' ? 'text-green-400 bg-green-400/10' :
                    entry.type === 'COMMAND' ? 'text-blue-400 bg-blue-400/10' :
                    entry.type === 'THINKING' ? 'text-purple-400 bg-purple-400/10' :
                    entry.type === 'GIT' ? 'text-cyan-400 bg-cyan-400/10' :
                    'text-[#888] bg-[#222]'
                  }`}>{entry.type}</span>
                  <span className="text-xs text-[#555]">{entry.agent}</span>
                </div>
                
                <p className="text-xs text-[#888] truncate">{entry.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {entries.length > maxItems && (
        <div className="px-4 py-2 border-t border-[#1a1a1a] text-center">
          <Link href="/live-feed" className="text-xs text-[#666] hover:text-purple-400 transition-colors">
            View all {entries.length} entries
          </Link>
        </div>
      )}
    </div>
  );
}

export function ActivityFeedCompact() {
  return <ActivityFeed maxItems={5} />;
}
