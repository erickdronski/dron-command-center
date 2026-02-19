'use client';
import { useState } from 'react';
import { FolderOpen, GripVertical } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: 'backlog' | 'inProgress' | 'testing' | 'live';
  channel: string;
  channelIcon: string;
  lastActivity: string;
  description?: string;
}

const initialProjects: Project[] = [
  { id: '1', name: 'FastLoop ML v9', status: 'testing', channel: '#polymarket-trades', channelIcon: '💸', lastActivity: '2 min ago', description: 'Smart exit strategy with 30% profit target' },
  { id: '2', name: 'X Posting Bot', status: 'live', channel: '#x-posts', channelIcon: '🐦', lastActivity: '1 hour ago', description: 'Every 3h posting schedule' },
  { id: '3', name: 'X Engagement Bot', status: 'live', channel: '#x-engagement', channelIcon: '💬', lastActivity: '30 min ago', description: '5x daily at peak hours' },
  { id: '4', name: 'Weather Trader', status: 'inProgress', channel: '#weather-trader', channelIcon: '🌦️', lastActivity: '2 hours ago', description: 'NOAA forecast vs Kalshi odds' },
  { id: '5', name: 'Arb Scanner', status: 'backlog', channel: '#trading', channelIcon: '⚡', lastActivity: 'Not started', description: 'Cross-platform arbitrage detection' },
  { id: '6', name: 'Daily Digest Cron', status: 'inProgress', channel: '#daily-digest', channelIcon: '📊', lastActivity: 'In development', description: '9 AM automated summary' },
  { id: '7', name: 'Sentiment Scanner', status: 'backlog', channel: '#opportunities', channelIcon: '🧠', lastActivity: 'Not started', description: 'Twitter/Reddit early signal detection' },
  { id: '8', name: 'Mission Control', status: 'live', channel: '#mission-control', channelIcon: '🚀', lastActivity: '5 min ago', description: 'AI-first command center dashboard' },
];

const COLUMNS = [
  { id: 'backlog',    title: 'Backlog',     border: 'border-[#333]',        dot: 'bg-[#555]',     header: 'text-[#888]' },
  { id: 'inProgress',title: 'In Progress', border: 'border-yellow-500/30', dot: 'bg-yellow-500', header: 'text-yellow-400' },
  { id: 'testing',   title: 'Testing',     border: 'border-blue-500/30',   dot: 'bg-blue-500',   header: 'text-blue-400' },
  { id: 'live',      title: 'Live',        border: 'border-green-500/30',  dot: 'bg-green-500',  header: 'text-green-400' },
];

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(initialProjects);
  const byStatus = (s: string) => projects.filter(p => p.status === s);
  const live = byStatus('live').length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#222] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen size={20} className="text-purple-400" />
            <h1 className="text-lg font-semibold">Projects</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center"><div className="text-xl font-bold text-white">{projects.length}</div><div className="text-xs text-[#555]">Total</div></div>
            <div className="text-center"><div className="text-xl font-bold text-green-400">{live}</div><div className="text-xs text-[#555]">Live</div></div>
            <div className="text-center"><div className="text-xl font-bold text-yellow-400">{byStatus('inProgress').length}</div><div className="text-xs text-[#555]">In Progress</div></div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map((col) => {
            const colProjects = byStatus(col.id);
            return (
              <div key={col.id} className={`w-64 flex flex-col bg-[#0d0d0d] rounded-lg border ${col.border}`}>
                <div className="flex items-center gap-2 px-3 py-3 border-b border-[#1a1a1a]">
                  <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${col.header}`}>{col.title}</span>
                  <span className="ml-auto text-xs text-[#555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">{colProjects.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colProjects.length === 0 ? (
                    <div className="flex items-center justify-center h-20 text-xs text-[#444]">Empty</div>
                  ) : (
                    colProjects.map((p) => (
                      <div key={p.id} className="bg-[#111] border border-[#1e1e1e] hover:border-[#333] rounded-lg p-3 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical size={12} className="text-[#444] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-base">{p.channelIcon}</span>
                          </div>
                          <span className="text-xs text-[#444]">{p.lastActivity}</span>
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{p.name}</div>
                        {p.description && <div className="text-xs text-[#555] mb-2 leading-relaxed">{p.description}</div>}
                        <div className="text-xs bg-[#1a1a1a] text-[#666] px-2 py-0.5 rounded inline-block">{p.channel}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
