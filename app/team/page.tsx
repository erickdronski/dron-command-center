'use client';

import { useEffect, useState } from 'react';
import { Users, ArrowRight, Activity, Clock, AlertCircle } from 'lucide-react';

interface Agent {
  emoji: string;
  name: string;
  role: string;
  desc: string;
  tags: string[];
  color: string;
  tagColor: string;
  status: 'active' | 'idle' | 'error';
  lastRun?: string;
  nextRun?: string;
  consecutiveErrors?: number;
  metrics?: Record<string, any>;
}

const BOSS = {
  emoji: '👤',
  name: 'Dron',
  role: 'Chief of Operations',
  desc: 'Steers direction, approves work, owns outcomes',
  tags: ['Strategy', 'Vision', 'Ownership'],
  color: 'border-purple-500/50 bg-purple-500/5',
  tagColor: 'bg-purple-500/20 text-purple-300',
};

export default function TeamPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(data => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status: string, errors?: number) => {
    if (errors && errors > 0) return { text: 'text-red-400', dot: 'bg-red-500', label: 'Error' };
    if (status === 'active') return { text: 'text-green-400', dot: 'bg-green-500', label: 'Active' };
    return { text: 'text-[#555]', dot: 'bg-[#444]', label: 'Idle' };
  };

  const formatTime = (iso?: string) => {
    if (!iso) return 'Unknown';
    const date = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatNextRun = (iso?: string) => {
    if (!iso) return 'Not scheduled';
    const date = new Date(iso);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (diff < 0) return 'Overdue';
    if (minutes < 60) return `in ${minutes}m`;
    if (hours < 24) return `in ${hours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-purple-400" />
          <div>
            <h1 className="text-lg font-semibold">AI Team</h1>
            <p className="text-sm text-[#555]">Active bots and their real-time status</p>
          </div>
        </div>
        <div className="text-xs text-[#555]">
          {agents.filter(a => a.status === 'active').length} active / {agents.length} total
        </div>
      </div>

      {/* Boss card */}
      <div className="flex justify-center">
        <div className={`w-80 border ${BOSS.color} rounded-xl p-6 text-center`}>
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
            {BOSS.emoji}
          </div>
          <div className="text-base font-bold text-white mb-0.5">{BOSS.name}</div>
          <div className="text-sm text-purple-400 mb-2">{BOSS.role}</div>
          <div className="text-xs text-[#888] mb-4">{BOSS.desc}</div>
          <div className="flex gap-2 justify-center">
            {BOSS.tags.map(t => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded ${BOSS.tagColor}`}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div className="text-center text-[#555] py-12">Loading team...</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const status = getStatusColor(agent.status, agent.consecutiveErrors);
            return (
              <div key={agent.name} className={`border ${agent.color} rounded-xl p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-2xl">
                    {agent.emoji}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${status.dot} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                    <span className={`text-xs ${status.text}`}>{status.label}</span>
                  </div>
                </div>

                <div className="text-sm font-bold text-white mb-0.5">{agent.name}</div>
                <div className={`text-xs mb-2 ${agent.tagColor.replace('bg-', 'text-').split(' ')[1]}`}>{agent.role}</div>
                <div className="text-xs text-[#666] mb-3">{agent.desc}</div>

                {/* Schedule Info */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#555]">
                    <Activity size={10} />
                    Last: {formatTime(agent.lastRun)}
                  </div>
                  {agent.nextRun && (
                    <div className="flex items-center gap-1.5 text-[#555]">
                      <Clock size={10} />
                      Next: {formatNextRun(agent.nextRun)}
                    </div>
                  )}
                  {agent.metrics && Object.entries(agent.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-1.5 text-[#666]">
                      <span className="text-[#444]">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  {agent.consecutiveErrors && agent.consecutiveErrors > 0 && (
                    <div className="flex items-center gap-1.5 text-red-400">
                      <AlertCircle size={10} />
                      {agent.consecutiveErrors} errors
                    </div>
                  )}
                </div>

                <div className="flex gap-1 flex-wrap mt-3">
                  {agent.tags.map(t => (
                    <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${agent.tagColor}`}>{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
