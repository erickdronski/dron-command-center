'use client';

import { useEffect, useState } from 'react';
import { Zap, Clock, CheckCircle2, Code, AlertCircle } from 'lucide-react';

interface WorkItem {
  id: string;
  title: string;
  status: 'active' | 'queued' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  estimatedTime: string;
  category: string;
  logs?: string[];
}

export default function AutonomousQueue() {
  const [queue, setQueue] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch('/api/autonomous-queue');
        const data = await res.json();
        setQueue(data);
      } catch (error) {
        console.error('Failed to fetch autonomous queue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const activeWork = queue.filter(w => w.status === 'active');
  const queuedWork = queue.filter(w => w.status === 'queued');
  const completedWork = queue.filter(w => w.status === 'completed').slice(0, 5);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">Loading autonomous queue...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-400 animate-pulse" />
          <div>
            <h2 className="text-xl font-bold">Autonomous Build Queue</h2>
            <p className="text-sm text-muted-foreground">
              Building continuously • {activeWork.length} active • {queuedWork.length} queued
            </p>
          </div>
        </div>
        <div className="text-sm text-purple-400 font-mono">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Active Work */}
      {activeWork.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            CURRENTLY BUILDING
          </h3>
          <div className="space-y-3">
            {activeWork.map(item => (
              <div key={item.id} className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.category} • Started {item.startedAt ? 
                        Math.round((Date.now() - new Date(item.startedAt).getTime()) / 60000) + 'm ago' : 
                        'just now'}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono">{item.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                {/* Recent Logs */}
                {item.logs && item.logs.length > 0 && (
                  <div className="mt-2 text-xs font-mono text-muted-foreground">
                    {item.logs.slice(-2).map((log, i) => (
                      <div key={i} className="truncate">→ {log}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queued Work */}
      {queuedWork.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            UP NEXT ({queuedWork.length})
          </h3>
          <div className="space-y-2">
            {queuedWork.slice(0, 5).map((item, index) => (
              <div key={item.id} className="bg-secondary/50 border border-border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono text-muted-foreground">#{index + 1}</div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.category} • {item.estimatedTime}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  item.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Completed */}
      {completedWork.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            RECENTLY COMPLETED
          </h3>
          <div className="space-y-2">
            {completedWork.map(item => (
              <div key={item.id} className="bg-green-900/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Completed {item.completedAt ? 
                        Math.round((Date.now() - new Date(item.completedAt).getTime()) / 60000) + 'm ago' : 
                        'recently'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeWork.length === 0 && queuedWork.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Autonomous queue empty</p>
          <p className="text-xs">Monitoring for opportunities...</p>
        </div>
      )}
    </div>
  );
}
