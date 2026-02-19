'use client';

import { useEffect, useState } from 'react';
import { Code, AlertCircle, CheckCircle2, Clock, FileCode, Activity } from 'lucide-react';

interface BuildLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface BuildStatus {
  proposalId: string | null;
  proposalTitle: string | null;
  status: 'idle' | 'building' | 'blocked' | 'completed' | 'failed';
  progress: number;
  startedAt: string | null;
  estimatedCompletion: string | null;
  blockers: Array<{
    type: string;
    message: string;
    needsUserAction: boolean;
  }>;
  currentTask: string | null;
  logs: BuildLog[];
  filesCreated: string[];
  filesModified: string[];
}

export default function BuildTracker() {
  const [status, setStatus] = useState<BuildStatus | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/build-status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch build status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, []);

  if (!status || status.status === 'idle') {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="w-5 h-5 opacity-50" />
          <span className="text-sm">No active builds</span>
        </div>
      </div>
    );
  }

  const statusColors = {
    building: 'border-yellow-500 bg-yellow-900/20',
    blocked: 'border-red-500 bg-red-900/20',
    completed: 'border-green-500 bg-green-900/20',
    failed: 'border-red-600 bg-red-900/30',
    idle: 'border-gray-600',
  };

  const statusIcons = {
    building: <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />,
    blocked: <AlertCircle className="w-5 h-5 text-red-500" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    failed: <AlertCircle className="w-5 h-5 text-red-600" />,
    idle: <Activity className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className={`border-2 rounded-lg ${statusColors[status.status]}`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {statusIcons[status.status]}
          <div>
            <h3 className="font-semibold">{status.proposalTitle || 'Building...'}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>{status.currentTask || 'Initializing...'}</span>
              {status.startedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round((Date.now() - new Date(status.startedAt).getTime()) / 1000 / 60)}m elapsed
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <span className="text-sm font-mono">{status.progress}%</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Blockers */}
          {status.blockers.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-500">Blockers ({status.blockers.length})</span>
              </div>
              {status.blockers.map((blocker, i) => (
                <div key={i} className="text-sm mb-2 last:mb-0">
                  <div className="font-medium">{blocker.type}</div>
                  <div className="text-muted-foreground">{blocker.message}</div>
                  {blocker.needsUserAction && (
                    <div className="text-yellow-500 text-xs mt-1">⚠️ Needs your action</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Files */}
          {(status.filesCreated.length > 0 || status.filesModified.length > 0) && (
            <div className="bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileCode className="w-4 h-4" />
                <span className="font-semibold text-sm">Files Changed</span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                {status.filesCreated.map((file, i) => (
                  <div key={i} className="text-green-500">+ {file}</div>
                ))}
                {status.filesModified.map((file, i) => (
                  <div key={i} className="text-yellow-500">~ {file}</div>
                ))}
              </div>
            </div>
          )}

          {/* Live Logs */}
          <div className="bg-black/50 rounded-lg p-3 max-h-64 overflow-y-auto font-mono text-xs">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4" />
              <span className="font-semibold">Build Log</span>
            </div>
            {status.logs.length === 0 ? (
              <div className="text-muted-foreground">Waiting for logs...</div>
            ) : (
              status.logs.map((log, i) => (
                <div 
                  key={i} 
                  className={`py-1 ${
                    log.type === 'error' ? 'text-red-500' :
                    log.type === 'success' ? 'text-green-500' :
                    log.type === 'warning' ? 'text-yellow-500' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
