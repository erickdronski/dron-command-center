'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Twitter, TrendingUp, Users, DollarSign, Calendar, ArrowRight, RefreshCw, AlertCircle, UploadCloud } from 'lucide-react';

interface DashData {
  posts: number;
  trades: number;
  kalshiSpent: number;
  jobs: number;
  deployments: number;
  activeJobs: number;
  errorJobs: number;
  xEngagement: {
    likes: number;
    replies: number;
    spent: number;
  };
  lastUpdated?: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [age, setAge] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/dashboard');
      const d = await r.json();
      setData(d);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!data?.lastUpdated) return;
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(data.lastUpdated!).getTime()) / 60000);
      setAge(diff <= 0 ? 'just now' : `${diff}m ago`);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [data?.lastUpdated]);

  const sections = [
    {
      href: '/posts',
      label: 'X / Twitter',
      icon: Twitter,
      iconColor: 'text-sky-400',
      borderColor: 'border-sky-500/20 hover:border-sky-500/50',
      stats: [
        { label: 'Total posts', value: data?.posts ?? '—' },
        { label: 'Likes', value: data?.xEngagement?.likes ?? '—' },
        { label: 'Replies', value: data?.xEngagement?.replies ?? '—' },
        { label: 'Budget spent', value: data ? `$${(data.xEngagement?.spent ?? 0).toFixed(3)}` : '—' },
      ],
    },
    {
      href: '/analytics',
      label: 'Trading',
      icon: TrendingUp,
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20 hover:border-green-500/50',
      stats: [
        { label: 'Kalshi trades', value: data?.trades ?? '—' },
        { label: 'Kalshi spent', value: data ? `$${data.kalshiSpent.toFixed(2)}` : '—' },
        { label: 'Deployments', value: data?.deployments ?? '—' },
        { label: '', value: '' },
      ],
    },
    {
      href: '/team',
      label: 'Team',
      icon: Users,
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20 hover:border-purple-500/50',
      stats: [
        { label: 'Active bots', value: data?.activeJobs ?? '—' },
        { label: 'Scheduled jobs', value: data?.jobs ?? '—' },
        { label: 'Error jobs', value: data?.errorJobs ?? '—', warn: (data?.errorJobs ?? 0) > 0 },
        { label: 'System', value: (data?.errorJobs ?? 0) === 0 ? 'Healthy' : 'Issues', warn: (data?.errorJobs ?? 0) > 0 },
      ],
    },
    {
      href: '/calendar',
      label: 'Schedule',
      icon: Calendar,
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/20 hover:border-orange-500/50',
      stats: [
        { label: 'Total crons', value: data?.jobs ?? '—' },
        { label: 'Errors', value: data?.errorJobs ?? '—', warn: (data?.errorJobs ?? 0) > 0 },
        { label: 'Status', value: (data?.errorJobs ?? 0) === 0 ? '✓ All running' : '⚠ Check needed', warn: (data?.errorJobs ?? 0) > 0 },
        { label: '', value: '' },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#555] mt-0.5">Mission Control — all systems at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="http://localhost:3001/sync"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#555] hover:text-green-400 border border-[#222] hover:border-green-500/40 px-3 py-1.5 rounded-lg transition-all"
            title="Runs local sync-server.js — syncs data files & pushes to GitHub. Vercel rebuilds in ~60s."
          >
            <UploadCloud size={11} />
            Sync to Vercel
          </a>
          <button
            onClick={load}
            className="flex items-center gap-2 text-xs text-[#555] hover:text-white border border-[#222] hover:border-[#444] px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {age ? `Cached ${age}` : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {(data?.errorJobs ?? 0) > 0 && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2.5 text-sm text-yellow-400">
          <AlertCircle size={14} />
          {data?.errorJobs} cron job{data?.errorJobs !== 1 ? 's' : ''} with errors — check Schedule
        </div>
      )}

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`bg-[#111] border ${s.borderColor} rounded-xl p-5 transition-all group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                  <s.icon size={16} className={s.iconColor} />
                </div>
                <span className="font-semibold text-white">{s.label}</span>
              </div>
              <ArrowRight size={14} className="text-[#444] group-hover:text-white transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {s.stats.filter(st => st.label).map((st) => (
                <div key={st.label}>
                  <div className={`text-lg font-bold ${(st as any).warn ? 'text-yellow-400' : 'text-white'}`}>
                    {loading ? <span className="text-[#333]">—</span> : st.value}
                  </div>
                  <div className="text-xs text-[#555]">{st.label}</div>
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/posts" className="bg-[#111] border border-[#1a1a1a] hover:border-sky-500/30 rounded-xl p-4 transition-all group">
          <Twitter size={18} className="text-sky-400 mb-3" />
          <div className="text-sm font-semibold text-white">X Posts</div>
          <div className="text-xs text-[#555] mt-0.5">Post archive &amp; engagement</div>
        </Link>
        <Link href="/analytics" className="bg-[#111] border border-[#1a1a1a] hover:border-green-500/30 rounded-xl p-4 transition-all group">
          <TrendingUp size={18} className="text-green-400 mb-3" />
          <div className="text-sm font-semibold text-white">Analytics</div>
          <div className="text-xs text-[#555] mt-0.5">Kalshi &amp; trading data</div>
        </Link>
        <Link href="/value-engineering" className="bg-[#111] border border-[#1a1a1a] hover:border-purple-500/30 rounded-xl p-4 transition-all group">
          <DollarSign size={18} className="text-purple-400 mb-3" />
          <div className="text-sm font-semibold text-white">Value Engineering</div>
          <div className="text-xs text-[#555] mt-0.5">Projects &amp; proposals</div>
        </Link>
      </div>
    </div>
  );
}
