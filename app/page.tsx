'use client';

import { useEffect, useState } from 'react';
import { Activity, DollarSign, TrendingUp, Users, Zap, AlertTriangle, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import BuildTracker from './components/BuildTracker';
import AutonomousQueue from './components/AutonomousQueue';
import PnLChart from './components/PnLChart';
import AgentOrgChart from './components/AgentOrgChart';

interface SystemStatus {
  trading: {
    polymarket: { active: boolean; positions: number; pnl24h: number; winRate: number };
    weather: { active: boolean; edges: number; pnl24h: number };
    combined: { pnl24h: number };
  };
  social: {
    followers: number; followerChange: number;
    postsToday: number; repliesToday: number; totalActivity: number;
    totalPosts: number;
    engagementRate: number;
  };
  system: {
    jobs: Array<{name: string; status: string; nextRun: string}>;
    errors: number;
  };
  activity: Array<{time: string; message: string}>;
  alerts: Array<{level: string; message: string}>;
}

export default function Dashboard() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/status');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-mono animate-pulse">Loading Command Center...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Autonomous Work Queue */}
      <div className="mb-8">
        <AutonomousQueue />
      </div>

      {/* Build Tracker */}
      <div className="mb-8">
        <BuildTracker />
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
            💸 Dron Command Center
          </h1>
          <p className="text-muted-foreground">Real-time monitoring • All systems</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/collaborate"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            <Activity className="w-5 h-5" />
            AI Workbench
          </Link>
          <Link 
            href="/projects"
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90"
          >
            <LayoutGrid className="w-5 h-5" />
            Projects
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trading Overview */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Trading Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Polymarket */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Polymarket</h3>
                <div className={`w-2 h-2 rounded-full ${data.trading.polymarket.active ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{data.trading.polymarket.positions} positions</div>
              <div className="text-sm text-muted-foreground">24h P&L: ${data.trading.polymarket.pnl24h.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Win rate: {data.trading.polymarket.winRate}%</div>
            </div>

            {/* Weather */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Weather</h3>
                <div className={`w-2 h-2 rounded-full ${data.trading.weather.active ? 'bg-green-500' : 'bg-yellow-500'}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{data.trading.weather.edges} edges</div>
              <div className="text-sm text-muted-foreground">24h P&L: ${data.trading.weather.pnl24h.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Watching markets</div>
            </div>

            {/* Combined */}
            <div className="bg-gradient-to-br from-green-900/20 to-yellow-900/20 border border-green-500/30 rounded-lg p-6">
              <h3 className="font-medium mb-2">Combined 24h</h3>
              <div className={`text-3xl font-bold ${data.trading.combined.pnl24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${data.trading.combined.pnl24h.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total P&L</div>
            </div>
          </div>
        </div>

        {/* 24H P&L Chart - LIVE */}
        <div>
          <PnLChart />
        </div>
      </div>

      {/* Agent Org Chart */}
      <div className="mb-8">
        <AgentOrgChart />
      </div>

      {/* Social Growth */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Social Growth
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-medium mb-2">Followers</h3>
            <div className="text-2xl font-bold">{data.social.followers.toLocaleString()}</div>
            <div className={`text-sm ${data.social.followerChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.social.followerChange >= 0 ? '↑' : '↓'} {Math.abs(data.social.followerChange)} today
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-medium mb-2">Today's Activity</h3>
            <div className="text-2xl font-bold">{data.social.totalActivity || (data.social.postsToday + data.social.repliesToday)}</div>
            <div className="text-sm text-muted-foreground">{data.social.postsToday || 0} posts • {data.social.repliesToday || 0} replies</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-medium mb-2">Engagement Rate</h3>
            <div className="text-2xl font-bold">{data.social.engagementRate}%</div>
            <div className="text-sm text-green-500">↑ Growing</div>
          </div>
        </div>
      </div>

      {/* System Health & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            System Health
          </h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-3">
              {data.system.jobs.map((job, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${job.status === 'running' ? 'bg-green-500' : job.status === 'idle' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                    <span className="font-medium">{job.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{job.nextRun}</span>
                </div>
              ))}
            </div>
            {data.system.errors > 0 && (
              <div className="mt-4 pt-4 border-t border-border text-red-500 text-sm">
                ⚠️ {data.system.errors} error(s) in last 24h
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed & Alerts */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            Live Activity
          </h2>
          
          {/* Alerts */}
          {data.alerts.length > 0 && (
            <div className="mb-4 space-y-2">
              {data.alerts.map((alert, i) => (
                <div key={i} className={`border rounded-lg p-3 ${alert.level === 'critical' ? 'bg-red-900/20 border-red-500/50' : 'bg-yellow-900/20 border-yellow-500/50'}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${alert.level === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {data.activity.map((item, i) => (
                <div key={i} className="text-sm py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground text-xs">{item.time}</span>
                  <span className="ml-2">{item.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
