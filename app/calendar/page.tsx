'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, RotateCcw, Zap, AlertCircle } from 'lucide-react';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  lastRun?: string;
  status: 'ok' | 'error' | 'running';
  consecutiveErrors: number;
}

export default function CalendarPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === date.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeUntil = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `in ${minutes}m`;
    if (hours < 24) return `in ${hours}h`;
    return `in ${Math.floor(hours / 24)}d`;
  };

  const getStatusColor = (status: string, errors: number) => {
    if (errors > 2) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (errors > 0) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (status === 'ok') return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-[#222] text-[#888] border-[#333]';
  };

  const activeJobs = jobs.filter(j => j.consecutiveErrors === 0);
  const errorJobs = jobs.filter(j => j.consecutiveErrors > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-purple-400" />
          <div>
            <h1 className="text-lg font-semibold">Cron Schedule</h1>
            <p className="text-sm text-[#555]">Live job schedule from OpenClaw</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{activeJobs.length}</div>
            <div className="text-xs text-[#555]">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{errorJobs.length}</div>
            <div className="text-xs text-[#555]">Errors</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-[#555] py-12">Loading schedule...</div>
      ) : (
        <>
          {/* Error Jobs First */}
          {errorJobs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-red-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400">Jobs With Errors</h2>
              </div>
              <div className="grid gap-3">
                {errorJobs.map((job) => (
                  <div key={job.id} className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle size={16} className="text-red-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{job.name}</div>
                          <div className="text-xs text-red-400">{job.consecutiveErrors} consecutive errors</div>
                        </div>
                      </div>
                      <div className="text-xs text-[#555]">{job.schedule}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw size={14} className="text-[#555]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#555]">All Scheduled Jobs</h2>
            </div>
            <div className="grid gap-3">
              {jobs
                .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())
                .map((job) => (
                <div key={job.id} className={`border rounded-lg p-4 ${getStatusColor(job.status, job.consecutiveErrors)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${job.consecutiveErrors > 0 ? 'bg-red-500' : job.status === 'ok' ? 'bg-green-500' : 'bg-[#555]'}`} />
                      <div>
                        <div className="text-sm font-medium">{job.name}</div>
                        <div className="text-xs opacity-70">{job.schedule}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{formatTime(job.nextRun)}</div>
                      <div className="text-xs opacity-70">
                        {formatDate(job.nextRun)} · {getTimeUntil(job.nextRun)}
                      </div>
                    </div>
                  </div>
                  
                  {job.lastRun && (
                    <div className="mt-2 text-xs opacity-50 flex items-center gap-1">
                      <Clock size={10} />
                      Last ran: {formatTime(job.lastRun)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-[#555] pt-4 border-t border-[#222]">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Healthy
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Warning
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Error
            </div>
          </div>
        </>
      )}
    </div>
  );
}
