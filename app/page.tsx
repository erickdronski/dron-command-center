'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckSquare, Zap, ThumbsUp, Calendar, TrendingUp, Activity, Rocket, BarChart2, Twitter, DollarSign, Users, CloudSun } from 'lucide-react';
import { PageHeader } from './components/PageHeader';
import { ActivityFeedCompact } from './components/ActivityFeed';

interface DashboardStats {
  posts: number;
  trades: number;
  jobs: number;
  deployments: number;
  activeJobs: number;
  errorJobs: number;
}

const quickLinks = [
  { href: '/analytics', icon: BarChart2, label: 'Analytics', desc: 'Trading & social metrics' },
  { href: '/deployments', icon: Rocket, label: 'Deploys', desc: 'Build history' },
  { href: '/posts', icon: Twitter, label: 'X Posts', desc: 'Content archive' },
  { href: '/calendar', icon: Calendar, label: 'Schedule', desc: 'Cron jobs' },
  { href: '/memory', icon: Zap, label: 'Memory', desc: 'AI brain' },
  { href: '/team', icon: Users, label: 'Team', desc: 'Bot status' },
  { href: '/weather', icon: CloudSun, label: 'Weather', desc: 'NOAA data' },
  { href: '/live-feed', icon: Activity, label: 'Live Feed', desc: 'Terminal' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'X Posts Today', value: stats.posts, icon: Twitter, color: 'text-sky-400', href: '/posts' },
    { label: 'Kalshi Trades', value: stats.trades, icon: DollarSign, color: 'text-green-400', href: '/analytics' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Activity, color: 'text-purple-400', href: '/calendar' },
    { label: 'Error Jobs', value: stats.errorJobs, icon: TrendingUp, color: stats.errorJobs > 0 ? 'text-red-400' : 'text-green-400', href: '/calendar' },
    { label: 'Total Jobs', value: stats.jobs, icon: Calendar, color: 'text-blue-400', href: '/calendar' },
    { label: 'Deployments', value: stats.deployments, icon: Rocket, color: 'text-cyan-400', href: '/deployments' },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Dashboard"
        subtitle="Dron Command Center — AI-first operations"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-[#111] border border-[#222] rounded-lg p-4 animate-pulse">
              <div className="h-8 bg-[#222] rounded mb-2"></div>
              <div className="h-4 bg-[#222] rounded w-20"></div>
            </div>
          ))
        ) : (
          cards.map((card) => (
            <Link key={card.label} href={card.href}
              className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-[#333] transition-colors"
            >
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-[#555] mt-1">{card.label}</div>
            </Link>
          ))
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-[#555] uppercase tracking-wider mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="bg-[#111] border border-[#222] rounded-lg p-4 hover:border-purple-500/50 hover:bg-[#141414] transition-all group"
            >
              <link.icon size={20} className="text-[#555] group-hover:text-purple-400 transition-colors mb-2" />
              <div className="text-sm font-medium text-white">{link.label}</div>
              <div className="text-xs text-[#555]">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeedCompact />
    </div>
  );
}
