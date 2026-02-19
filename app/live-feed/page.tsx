'use client';
import { useEffect, useState, useRef } from 'react';
import { Terminal, Cpu } from 'lucide-react';

const TYPE_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  FILE_EDIT: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'FILE_EDIT' },
  COMMAND:   { color: 'text-blue-400',  bg: 'bg-blue-400/10',  label: 'COMMAND' },
  THINKING:  { color: 'text-purple-400',bg: 'bg-purple-400/10',label: 'THINKING' },
  DEPLOY:    { color: 'text-yellow-400',bg: 'bg-yellow-400/10',label: 'DEPLOY' },
  GIT:       { color: 'text-cyan-400',  bg: 'bg-cyan-400/10',  label: 'GIT' },
  PROPOSAL:  { color: 'text-pink-400',  bg: 'bg-pink-400/10',  label: 'PROPOSAL' },
};

interface FeedEntry {
  id: string;
  timestamp: string;
  type: string;
  message: string;
  agent: string;
}

export default function LiveFeedPage() {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/live-feed');
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLive) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, isLive]);

  const latest = entries[entries.length - 1];

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#222] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Terminal size={20} className="text-purple-400" />
          <h1 className="text-lg font-semibold">Live Feed</h1>
          <span className="text-sm text-[#555]">Real-time agent activity</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`text-xs px-3 py-1 rounded border transition-colors ${
              isLive ? 'border-red-500 text-red-400 hover:bg-red-500/10' : 'border-[#333] text-[#666] hover:bg-[#1a1a1a]'
            }`}
          >
            {isLive ? '⏸ PAUSE' : '▶ RESUME'}
          </button>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 font-mono font-bold">LIVE</span>
          </div>
        </div>
      </div>

      {/* Current task banner */}
      {latest && (
        <div className="px-6 py-3 bg-[#111] border-b border-[#222] flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <Cpu size={14} className="text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-[#666]">Current:</span>
            <span className={`font-mono ${TYPE_COLORS[latest.type]?.color || 'text-white'}`}>
              {latest.message}
            </span>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="flex-1 overflow-y-auto font-mono text-sm">
        <div className="p-6 space-y-1">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#444]">
              <Terminal size={24} className="mb-2 opacity-30" />
              <div className="text-xs">Waiting for activity...</div>
            </div>
          ) : (
            entries.map((entry) => {
              const typeInfo = TYPE_COLORS[entry.type] || { color: 'text-white', bg: 'bg-white/5', label: entry.type };
              const time = new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false });
              return (
                <div key={entry.id} className={`flex items-start gap-3 px-3 py-2 rounded ${typeInfo.bg} group`}>
                  <span className="text-[#444] text-xs shrink-0 mt-0.5 w-16">{time}</span>
                  <span className={`text-xs shrink-0 mt-0.5 px-1.5 py-0.5 rounded border ${typeInfo.color} border-current/30 min-w-[70px] text-center`}>
                    {typeInfo.label}
                  </span>
                  <span className="text-[#888] text-xs shrink-0 mt-0.5 w-24 truncate">{entry.agent}</span>
                  <span className="text-white/90 break-all">{entry.message}</span>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-[#222] flex items-center justify-between text-xs text-[#555] flex-shrink-0">
        <span>{entries.length} entries</span>
        <span>Auto-refresh every 3s</span>
      </div>
    </div>
  );
}
