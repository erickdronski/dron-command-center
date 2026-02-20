'use client';

import { useEffect, useState } from 'react';
import {
  BarChart2, TrendingUp, TrendingDown, Twitter, Zap,
  Activity, Users, DollarSign, RefreshCw, CheckCircle2,
  AlertCircle, Target, Bot
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StatusData {
  trading: {
    polymarket: { active: boolean; positions: number; pnl24h: number; winRate: number; totalTrades24h: number };
    weather: { active: boolean; edges: number; pnl24h: number };
    combined: { pnl24h: number };
  };
  social: {
    followers: number; followerChange: number; postsToday: number; repliesToday: number;
    totalActivity: number; totalPosts: number; engagementRate: number;
    budgetSpent: number; dailyBudget: number;
  };
  system: {
    jobs: { name: string; status: string; nextRun: string; enabled: boolean; lastRun: string }[];
    errors: number; totalJobs: number; activeJobs: number;
  };
  alerts: { level: string; message: string }[];
  lastUpdated: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function pct(val: number, max: number) {
  return Math.max(0, Math.min(100, (val / Math.max(max, 1)) * 100));
}
function sign(n: number) { return n >= 0 ? '+' : ''; }
function fmt(n: number, digits = 2) { return n.toFixed(digits); }

// ── Sub-components ─────────────────────────────────────────────────────────
function StatCard({
  icon: Icon, label, value, sub, color = 'text-white', trend,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  color?: string; trend?: 'up' | 'down' | 'neutral';
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#555] font-medium uppercase tracking-wider">{label}</span>
        <Icon size={16} className="text-[#333]" />
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && (
        <div className="flex items-center gap-1 mt-1 text-xs text-[#555]">
          {TrendIcon && <TrendIcon size={11} className={trend === 'up' ? 'text-green-400' : 'text-red-400'} />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

function BarRow({ label, value, max, color, suffix = '' }: {
  label: string; value: number; max: number; color: string; suffix?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#888]">{label}</span>
        <span className="text-white font-medium">{value}{suffix}</span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct(value, max)}%` }} />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-[#555]" />
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {sub && <span className="text-xs text-[#555]">{sub}</span>}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/status');
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const s = data?.social;
  const t = data?.trading;
  const sys = data?.system;

  const totalPnl = t ? t.combined.pnl24h : 0;
  const winRate = t?.polymarket.winRate ?? 0;
  const positions = t?.polymarket.positions ?? 0;
  const trades = t?.polymarket.totalTrades24h ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 size={20} className="text-purple-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">Analytics</h1>
            <p className="text-xs text-[#555] mt-0.5">All projects & profiles — live data</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {data?.alerts && data.alerts.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded">
              <AlertCircle size={12} />
              {data.alerts.length} alert{data.alerts.length > 1 ? 's' : ''}
            </div>
          )}
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#222] hover:border-[#444]"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : `Updated ${lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {data?.alerts && data.alerts.length > 0 && (
        <div className="space-y-2 mb-6">
          {data.alerts.map((a, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded border ${
              a.level === 'critical'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            }`}>
              <AlertCircle size={14} />
              {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Top stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={DollarSign}
          label="P&L 24h"
          value={`${sign(totalPnl)}$${fmt(Math.abs(totalPnl))}`}
          sub={`${positions} open position${positions !== 1 ? 's' : ''}`}
          color={totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}
          trend={totalPnl >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon={Users}
          label="X Followers"
          value={s ? s.followers.toLocaleString() : '—'}
          sub={s ? `${sign(s.followerChange)}${s.followerChange} today` : undefined}
          color="text-white"
          trend={s && s.followerChange >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon={Target}
          label="Win Rate"
          value={winRate > 0 ? `${fmt(winRate, 1)}%` : '—'}
          sub={`${trades} trade${trades !== 1 ? 's' : ''} today`}
          color={winRate >= 60 ? 'text-green-400' : winRate >= 50 ? 'text-yellow-400' : 'text-red-400'}
        />
        <StatCard
          icon={Activity}
          label="Active Bots"
          value={sys ? `${sys.activeJobs}/${sys.totalJobs}` : '—'}
          sub={sys && sys.errors > 0 ? `${sys.errors} error${sys.errors > 1 ? 's' : ''}` : 'All healthy'}
          color="text-white"
          trend={sys && sys.errors === 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* X / Twitter Analytics */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5">
          <SectionHeader icon={Twitter} title="X (Twitter)" sub="@DronskiErick" />

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Followers', value: s?.followers.toLocaleString() ?? '—' },
              { label: 'Posts today', value: s?.postsToday?.toString() ?? '—' },
              { label: 'Replies', value: s?.repliesToday?.toString() ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0d0d0d] rounded p-3 text-center">
                <div className="text-lg font-bold text-white">{value}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {s && (
            <>
              <BarRow
                label="Follower goal (10k)"
                value={s.followers}
                max={10000}
                color="bg-blue-500"
              />
              <BarRow
                label={`Daily posts (${s.postsToday}/${s.totalPosts})`}
                value={s.postsToday}
                max={s.totalPosts}
                color="bg-purple-500"
              />
              <BarRow
                label={`API budget ($${fmt(s.budgetSpent)}/$${fmt(s.dailyBudget)})`}
                value={s.budgetSpent}
                max={s.dailyBudget}
                color={s.budgetSpent / s.dailyBudget > 0.8 ? 'bg-red-500' : 'bg-green-500'}
              />
              <div className="mt-3 pt-3 border-t border-[#1a1a1a] text-xs text-[#555]">
                Engagement rate: <span className="text-white">{s.engagementRate > 0 ? `${fmt(s.engagementRate, 1)}%` : 'n/a'}</span>
                &nbsp;·&nbsp; Total activity: <span className="text-white">{s.totalActivity}</span>
              </div>
            </>
          )}
          {!s && !loading && <p className="text-xs text-[#444]">No social data available</p>}
        </div>

        {/* Trading Analytics */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5">
          <SectionHeader icon={DollarSign} title="Polymarket Trading" sub="FastLoop v8 + Weather Bot" />

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'P&L 24h', value: t ? `${sign(t.combined.pnl24h)}$${fmt(Math.abs(t.combined.pnl24h))}` : '—', color: t && t.combined.pnl24h >= 0 ? 'text-green-400' : 'text-red-400' },
              { label: 'Positions', value: t?.polymarket.positions.toString() ?? '—', color: 'text-white' },
              { label: 'Win rate', value: winRate > 0 ? `${fmt(winRate, 1)}%` : '—', color: winRate >= 60 ? 'text-green-400' : 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#0d0d0d] rounded p-3 text-center">
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {t && (
            <>
              <BarRow
                label={`Win rate (${fmt(winRate, 1)}% / target 65%)`}
                value={winRate}
                max={100}
                color={winRate >= 65 ? 'bg-green-500' : winRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                suffix="%"
              />
              <BarRow
                label="Weather bot"
                value={t.weather.active ? 1 : 0}
                max={1}
                color={t.weather.active ? 'bg-cyan-500' : 'bg-[#333]'}
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555]">FastLoop v8 (ML)</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${t.polymarket.active ? 'bg-green-500/20 text-green-400' : 'bg-[#222] text-[#555]'}`}>
                    {t.polymarket.active ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#555]">Weather Bot (NOAA)</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${t.weather.active ? 'bg-green-500/20 text-green-400' : 'bg-[#222] text-[#555]'}`}>
                    {t.weather.active ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
              </div>
            </>
          )}
          {!t && !loading && <p className="text-xs text-[#444]">No trading data available</p>}
        </div>
      </div>

      {/* Bots / Cron Jobs */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5 mb-6">
        <SectionHeader icon={Bot} title="Automated Jobs" sub={sys ? `${sys.activeJobs} active` : ''} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(sys?.jobs ?? []).map((job) => (
            <div key={job.name} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{job.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  !job.enabled ? 'bg-[#222] text-[#555]' :
                  job.status === 'running' ? 'bg-green-500/20 text-green-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {!job.enabled ? 'DISABLED' : job.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-[#555] space-y-0.5">
                <div>Next: <span className="text-[#888]">{job.nextRun}</span></div>
                <div>Last: <span className={job.lastRun === 'Success' ? 'text-green-400' : 'text-[#888]'}>{job.lastRun}</span></div>
              </div>
            </div>
          ))}
          {(!sys?.jobs || sys.jobs.length === 0) && (
            <p className="text-xs text-[#444] col-span-3">No job data available</p>
          )}
        </div>
      </div>

      {/* Projects summary */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5">
        <SectionHeader icon={Zap} title="Projects" sub="Status snapshot" />
        <div className="space-y-3">
          {[
            { name: 'Dron Command Center', desc: 'Next.js dashboard + AI collaboration', status: 'live', url: 'dron-command-center.vercel.app' },
            { name: 'Polymarket FastLoop v8', desc: 'ML trading bot — Simmer Markets API', status: 'active' },
            { name: 'Weather Trading Bot', desc: 'NOAA → Polymarket temperature arbitrage', status: 'active' },
            { name: 'X Automation', desc: 'Follower growth — reply & post strategy', status: 'active' },
            { name: 'YouTube Content Pipeline', desc: 'AI tools build-in-public content', status: 'backlog' },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
              <div>
                <div className="text-sm font-medium text-white">{p.name}</div>
                <div className="text-xs text-[#555] mt-0.5">{p.desc}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {p.url && <span className="text-xs text-[#444]">{p.url}</span>}
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  p.status === 'live' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  p.status === 'active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-[#1a1a1a] text-[#555] border-[#222]'
                }`}>
                  {p.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#333] mt-6">
        Auto-refreshes every 30s · Data from X API, Polymarket/Simmer, OpenClaw cron
      </p>
    </div>
  );
}
