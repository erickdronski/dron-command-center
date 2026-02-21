"use client";

import { useEffect, useState } from "react";
import { 
  GitCommit, GitBranch, Clock, ExternalLink, RotateCcw, 
  FileEdit, Command, Brain, Zap, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import Link from "next/link";

interface ActivityEntry {
  id: string;
  timestamp: string;
  type: "FILE_EDIT" | "COMMAND" | "THINKING" | "GIT" | "BUILD" | "DEPLOY";
  message: string;
  agent: string;
  metadata?: {
    branch?: string;
    commit?: string;
    duration?: number; // in seconds
    deployUrl?: string;
    files?: string[];
    status?: "success" | "failed" | "pending";
  };
}

interface ActivityFeedProps {
  entries?: ActivityEntry[];
  maxItems?: number;
  showFilters?: boolean;
}

const typeConfig = {
  FILE_EDIT: { icon: FileEdit, color: "text-green-400", bg: "bg-green-400/10", label: "EDIT" },
  COMMAND: { icon: Command, color: "text-blue-400", bg: "bg-blue-400/10", label: "CMD" },
  THINKING: { icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10", label: "THINK" },
  GIT: { icon: GitCommit, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "GIT" },
  BUILD: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "BUILD" },
  DEPLOY: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", label: "DEPLOY" },
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ entries: propEntries, maxItems = 10, showFilters = true }: ActivityFeedProps) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ActivityEntry["type"] | "ALL">("ALL");

  useEffect(() => {
    if (propEntries) {
      setEntries(propEntries);
      setLoading(false);
      return;
    }

    const fetchFeed = async () => {
      try {
        const res = await fetch("/api/live-feed");
        const data = await res.json();
        
        // Transform feed data to enriched format
        const enriched = data.map((entry: any, index: number) => ({
          ...entry,
          metadata: {
            ...entry.metadata,
            // Add mock metadata for demo purposes
            branch: entry.type === "GIT" ? "main" : undefined,
            commit: entry.type === "GIT" ? entry.id.slice(0, 7) : undefined,
            duration: entry.type === "BUILD" ? Math.floor(Math.random() * 120) + 30 : undefined,
            status: entry.type === "BUILD" ? (Math.random() > 0.1 ? "success" : "failed") : undefined,
          }
        }));
        
        setEntries(enriched);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 10000);
    return () => clearInterval(interval);
  }, [propEntries]);

  const filteredEntries = filter === "ALL" 
    ? entries 
    : entries.filter(e => e.type === filter);

  const displayEntries = filteredEntries.slice(0, maxItems);

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1a1a1a] flex items-center justify-between">
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
        
        {showFilters && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityEntry["type"] | "ALL")}
            className="text-xs bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 text-[#888] focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All types</option>
            <option value="GIT">Git</option>
            <option value="BUILD">Builds</option>
            <option value="DEPLOY">Deploys</option>
            <option value="FILE_EDIT">Edits</option>
            <option value="COMMAND">Commands</option>
          </select>
        )}
      </div>
      
      <div className="divide-y divide-[#1a1a1a] max-h-96 overflow-y-auto">
        {displayEntries.length === 0 ? (
          <div className="px-4 py-8 text-center text-[#555] text-sm">
            No activity found
          </div>
        ) : (
          displayEntries.map((entry) => {
            const config = typeConfig[entry.type];
            const Icon = config.icon;
            
            return (
              <div 
                key={entry.id} 
                className="px-4 py-3 hover:bg-[#151515] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded ${config.bg} flex items-center justify-center mt-0.5`}>
                    <Icon size={14} className={config.color} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-[#555]">{entry.agent}</span>
                      <span className="text-xs text-[#444] ml-auto">
                        {formatTimestamp(entry.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#888] leading-relaxed">
                      {entry.message}
                    </p>
                    
                    {/* Metadata row */}
                    {entry.metadata && (
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        {entry.metadata.branch && (
                          <span className="flex items-center gap-1 text-[#555]">
                            <GitBranch size={10} />
                            {entry.metadata.branch}
                          </span>
                        )}
                        
                        {entry.metadata.commit && (
                          <span className="font-mono text-[#666]">
                            {entry.metadata.commit}
                          </span>
                        )}
                        
                        {entry.metadata.duration && (
                          <span className="flex items-center gap-1 text-[#555]">
                            <Clock size={10} />
                            {formatDuration(entry.metadata.duration)}
                          </span>
                        )}
                        
                        {entry.metadata.status && (
                          <span className={`flex items-center gap-1 ${
                            entry.metadata.status === "success" ? "text-green-400" : "text-red-400"
                          }`}>
                            {entry.metadata.status === "success" ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {entry.metadata.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {entry.type === "DEPLOY" && entry.metadata?.deployUrl && (
                      <Link
                        href={entry.metadata.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                      >
                        <ExternalLink size={12} />
                        View
                      </Link>
                    )}
                    
                    {entry.type === "BUILD" && entry.metadata?.status === "failed" && (
                      <button
                        className="flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300"
                        onClick={() => alert("Retry build triggered")}
                      >
                        <RotateCcw size={12} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {entries.length > maxItems && (
        <div className="px-4 py-2 border-t border-[#1a1a1a] text-center">
          <Link 
            href="/live-feed"
            className="text-xs text-[#666] hover:text-purple-400 transition-colors"
          >
            View all {entries.length} entries →
          </Link>
        </div>
      )}
    </div>
  );
}

// Simple version for dashboard
export function ActivityFeedCompact({ entries }: { entries?: ActivityEntry[] }) {
  return <ActivityFeed entries={entries} maxItems={5} showFilters={false} />;
}
