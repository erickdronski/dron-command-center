"use client";

import { useEffect, useState } from "react";
import { 
  GitCommit, Clock, CheckCircle2, XCircle, Loader2, 
  ExternalLink, RotateCcw, AlertCircle, User, Calendar
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/HealthStatus";
import { SkeletonList } from "../components/Skeleton";

interface Deployment {
  id: string;
  commit: string;
  message: string;
  branch: string;
  author: string;
  status: "success" | "failed" | "building" | "pending";
  startedAt: string;
  completedAt?: string;
  duration?: number;
  url?: string;
  changes: {
    added: string[];
    modified: string[];
    deleted: string[];
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  useEffect(() => {
    // Simulate fetching deployment data
    // In production, this would hit your Vercel/GitHub APIs
    const fetchDeployments = async () => {
      setLoading(true);
      try {
        // Mock data based on actual feed.json entries
        const mockDeployments: Deployment[] = [
          {
            id: "1771545318723",
            commit: "a1b2c3d",
            message: "feat: NOAA weather page with trading signals",
            branch: "main",
            author: "Dron Builder",
            status: "success",
            startedAt: "2026-02-19T23:55:00Z",
            completedAt: "2026-02-19T23:56:30Z",
            duration: 90,
            url: "https://dron-command-center.vercel.app",
            changes: {
              added: ["app/weather/page.tsx", "app/api/weather/route.ts"],
              modified: ["app/layout.tsx"],
              deleted: []
            }
          },
          {
            id: "1771545318720",
            commit: "e4f5g6h",
            message: "fix: sidebar navigation active states",
            branch: "main",
            author: "Dron Builder",
            status: "success",
            startedAt: "2026-02-19T23:45:00Z",
            completedAt: "2026-02-19T23:46:15Z",
            duration: 75,
            url: "https://dron-command-center.vercel.app",
            changes: {
              added: [],
              modified: ["app/layout.tsx", "app/globals.css"],
              deleted: []
            }
          },
          {
            id: "1771545000000",
            commit: "i7j8k9l",
            message: "feat: add analytics dashboard with Kalshi data",
            branch: "main",
            author: "Dron Builder",
            status: "success",
            startedAt: "2026-02-19T23:30:00Z",
            completedAt: "2026-02-19T23:31:45Z",
            duration: 105,
            url: "https://dron-command-center.vercel.app",
            changes: {
              added: ["app/analytics/page.tsx"],
              modified: ["lib/data-sources.ts"],
              deleted: []
            }
          },
          {
            id: "1771544000000",
            commit: "m0n1o2p",
            message: "wip: experimental dark mode toggle",
            branch: "feature/dark-mode",
            author: "Dron Builder",
            status: "failed",
            startedAt: "2026-02-19T23:15:00Z",
            completedAt: "2026-02-19T23:15:30Z",
            duration: 30,
            url: undefined,
            changes: {
              added: [],
              modified: ["app/layout.tsx"],
              deleted: []
            }
          },
          {
            id: "1771543000000",
            commit: "q3r4s5t",
            message: "feat: full Mission Control rebuild with live feed",
            branch: "main",
            author: "Dron Builder",
            status: "success",
            startedAt: "2026-02-19T11:00:00Z",
            completedAt: "2026-02-19T11:02:30Z",
            duration: 150,
            url: "https://dron-command-center.vercel.app",
            changes: {
              added: ["app/layout.tsx", "app/tasks/page.tsx", "app/memory/page.tsx"],
              modified: [],
              deleted: []
            }
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeployments(mockDeployments);
      } catch (error) {
        console.error("Failed to fetch deployments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  const filteredDeployments = filter === "all" 
    ? deployments 
    : deployments.filter(d => d.status === filter);

  const successCount = deployments.filter(d => d.status === "success").length;
  const failedCount = deployments.filter(d => d.status === "failed").length;
  const successRate = deployments.length > 0 
    ? Math.round((successCount / deployments.length) * 100) 
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Deployments"
        subtitle="Build history and rollback management"
        actions={
          <Link
            href="/.github/workflows/deploy.yml"
            className="flex items-center gap-2 text-sm text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
          >
            View Workflow
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{deployments.length}</div>
          <div className="text-xs text-[#555] mt-1">Total Deployments</div>
        </div>
        
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{successRate}%</div>
          <div className="text-xs text-[#555] mt-1">Success Rate</div>
        </div>
        
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
          <div className="text-xs text-[#555] mt-1">Successful</div>
        </div>
        
        <div className="bg-[#111] border border-[#222] rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{failedCount}</div>
          <div className="text-xs text-[#555] mt-1">Failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {(["all", "success", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              filter === f
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-[#666] hover:text-white border border-[#222] hover:border-[#333]"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
          <div className="divide-y divide-[#1a1a1a]">
            {filteredDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className="p-4 hover:bg-[#151515] transition-colors cursor-pointer"
                onClick={() => setSelectedDeployment(deployment)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <StatusBadge status={deployment.status} showIcon={false} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <GitCommit size={14} className="text-[#555]" />
                      <span className="font-mono text-xs text-[#666]">{deployment.commit}</span>
                      <span className="text-xs text-[#555]">on</span>
                      <span className="text-xs text-purple-400">{deployment.branch}</span>
                      <span className="text-xs text-[#444] ml-auto">
                        {formatDate(deployment.startedAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-white font-medium mb-2">{deployment.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-[#555]">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {deployment.author}
                      </span>
                      
                      {deployment.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDuration(deployment.duration)}
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1">
                        {deployment.changes.added.length > 0 && `+${deployment.changes.added.length}`}
                        {deployment.changes.modified.length > 0 && ` ~${deployment.changes.modified.length}`}
                        {deployment.changes.deleted.length > 0 && ` -${deployment.changes.deleted.length}`}
                        <span className="ml-1">files</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {deployment.url && (
                      <Link
                        href={deployment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[#666] hover:text-purple-400 transition-colors px-2 py-1 rounded border border-[#222] hover:border-purple-500/30"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        View
                      </Link>
                    )}
                    
                    <button
                      className="flex items-center gap-1 text-xs text-[#666] hover:text-yellow-400 transition-colors px-2 py-1 rounded border border-[#222] hover:border-yellow-500/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Rollback to ${deployment.commit} triggered`);
                      }}
                    >
                      <RotateCcw size={12} />
                      Rollback
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedDeployment && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDeployment(null)}
        >
          <div 
            className="bg-[#111] border border-[#222] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedDeployment.status} />
                <span className="font-mono text-sm text-[#666]">{selectedDeployment.commit}</span>
              </div>
              <button
                onClick={() => setSelectedDeployment(null)}
                className="text-[#666] hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-lg text-white">{selectedDeployment.message}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#555]">Branch:</span>
                  <span className="ml-2 text-purple-400">{selectedDeployment.branch}</span>
                </div>
                <div>
                  <span className="text-[#555]">Author:</span>
                  <span className="ml-2 text-white">{selectedDeployment.author}</span>
                </div>
                <div>
                  <span className="text-[#555]">Started:</span>
                  <span className="ml-2 text-[#888]">{formatDate(selectedDeployment.startedAt)}</span>
                </div>
                <div>
                  <span className="text-[#555]">Duration:</span>
                  <span className="ml-2 text-[#888]">
                    {selectedDeployment.duration ? formatDuration(selectedDeployment.duration) : "N/A"}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-[#222] pt-4">
                <h3 className="text-sm font-semibold text-[#555] mb-2">Changes</h3>
                
                {selectedDeployment.changes.added.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-green-400">Added:</span>
                    <div className="mt-1 space-y-1">
                      {selectedDeployment.changes.added.map((file, i) => (
                        <div key={i} className="text-xs text-[#888] font-mono">+ {file}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDeployment.changes.modified.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-yellow-400">Modified:</span>
                    <div className="mt-1 space-y-1">
                      {selectedDeployment.changes.modified.map((file, i) => (
                        <div key={i} className="text-xs text-[#888] font-mono">~ {file}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded text-sm font-medium hover:bg-purple-500/30 transition-colors"
                  onClick={() => {
                    alert(`Rollback to ${selectedDeployment.commit} triggered`);
                    setSelectedDeployment(null);
                  }}
                >
                  <RotateCcw size={14} />
                  Rollback to this version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
