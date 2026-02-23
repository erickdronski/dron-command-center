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
    kalshi: { active: boolean; trades: number; spent: number; budget: number; weatherTrades: number; priceTrades: number };
    polymarket: { active: boolean; positions: number; tradesTotal: number };
  };
  social: {
    followers: number; postsToday: number; repliesToday: number; likesToday: number;
    totalActivity: number; budgetSpent: number; budgetLimit: number;
  };
  system: {
    jobs: { name: string; status: string; nextRun: string; enabled: boolean; lastRun: string; consecutiveErrors: number }[];
    errors: number; totalJobs: number; activeJobs: number;
  };
  activity: { time: string; message: string }[];
  alerts: { level: string; message: string }[];
  lastUpdated: string;
}

interface KalshiTrade {
  ts: string;
  ticker: string;
  type?: string;
  side: string;
  costUsd: number;
  orderId: string;
}

interface KalshiData {
  ok: boolean;
  date?: string;
  lastUpdated?: string;
  budget?: {
    totalLimitCents: number;
    totalSpentCents: number;
    totalRemainingCents: number;
    totalPct: number;
  };
  weatherTrader?: {
    tradesDay: number;
    spentCents: number;
    budgetCents: number;
    budgetPct: number;
    lastTrade: string | null;
    lastTicker: string | null;
    trades: KalshiTrade[];
  };
  priceFarmer?: {
    tradesDay: number;
    spentCents: number;
    budgetCents: number;
    budgetPct: number;
    trades: KalshiTrade[];
  };
  error?: string;
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
  const [kalshi, setKalshi] = useState<KalshiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statusRes, kalshiRes] = await Promise.allSettled([
        fetch('/api/status').then(r => r.json()),
        fetch('/api/kalshi').then(r => r.json()),
      ]);
      if (statusRes.status === 'fulfilled') setData(statusRes.value);
      if (kalshiRes.status === 'fulfilled') setKalshi(kalshiRes.value);
      setLastRefresh(new Date());
    } catch {
      // keep stale data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const s = data?.social;
  const sys = data?.system;
  const kalshi = data?.trading?.kalshi;

  const totalSpent = kalshi?.spent ?? 0;
  const totalBudget = kalshi?.budget ?? 18;
  const budgetPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

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
          label="Kalshi spent today"
          value={kalshi ? `$${fmt(totalSpent)}` : '—'}
          sub={`$${fmt(totalBudget - totalSpent)} remaining · ${budgetPct}%`}
          color={budgetPct >= 90 ? 'text-red-400' : budgetPct >= 70 ? 'text-yellow-400' : 'text-green-400'}
          trend={budgetPct < 90 ? 'up' : 'down'}
        />
        <StatCard
          icon={Users}
          label="X Activity"
          value={s ? `${s.totalActivity}` : '—'}
          sub={s ? `${s.postsToday} posts · ${s.repliesToday} replies · ${s.likesToday} likes` : undefined}
          color="text-white"
        />
        <StatCard
          icon={Target}
          label="Trades today"
          value={kalshi ? `${kalshi.trades}` : '—'}
          sub={kalshi ? `${kalshi.weatherTrades} weather · ${kalshi.priceTrades} price` : undefined}
          color="text-cyan-400"
        />
        <StatCard
          icon={Activity}
          label="Active Jobs"
          value={sys ? `${sys.activeJobs}/${sys.totalJobs}` : '—'}
          sub={sys && sys.errors > 0 ? `${sys.errors} with errors` : 'All healthy'}
          color={sys && sys.errors === 0 ? 'text-green-400' : 'text-yellow-400'}
          trend={sys && sys.errors === 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* X / Twitter Analytics */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5">
          <SectionHeader icon={Twitter} title="X (Twitter)" sub="@DronskiErick" />

          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Posts', value: s?.postsToday?.toString() ?? '—' },
              { label: 'Replies', value: s?.repliesToday?.toString() ?? '—' },
              { label: 'Likes', value: s?.likesToday?.toString() ?? '—' },
              { label: 'Budget', value: s ? `$${fmt(s.budgetSpent)}/$${fmt(s.budgetLimit)}` : '—' },
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
                label={`Daily budget ($${fmt(s.budgetSpent)}/$${fmt(s.budgetLimit)})`}
                value={s.budgetSpent}
                max={s.budgetLimit}
                color={s.budgetSpent / s.budgetLimit > 0.8 ? 'bg-red-500' : 'bg-green-500'}
              />
              <div className="mt-3 pt-3 border-t border-[#1a1a1a] text-xs text-[#555]">
                Total activity today: <span className="text-white">{s.totalActivity}</span>
              </div>
            </>
          )}
          {!s && !loading && <p className="text-xs text-[#444]">No X data available</p>}
        </div>

        {/* Kalshi Trading */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader icon={DollarSign} title="Kalshi Trading" sub="Weather + Price Farmer bots" />
            {kalshi?.date && (
              <span className="text-[10px] text-[#444]">
                {new Date(kalshi.lastUpdated ?? '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            )}
          </div>

          {kalshi?.ok && kalshi.budget && wt && pf ? (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Total spent', value: `$${fmt(kalshi.budget.totalSpentCents / 100)}`, sub: `/ $${fmt(kalshi.budget.totalLimitCents / 100)}`, color: 'text-white' },
                  { label: 'Weather trades', value: String(wt.tradesDay), sub: `$${fmt(wt.spentCents / 100)} spent`, color: 'text-cyan-400' },
                  { label: 'Price Farmer', value: String(pf.tradesDay), sub: `$${fmt(pf.spentCents / 100)} spent`, color: 'text-purple-400' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="bg-[#0d0d0d] rounded p-3 text-center">
                    <div className={`text-lg font-bold ${color}`}>{value}</div>
                    <div className="text-[10px] text-[#555] mt-0.5">{label}</div>
                    {sub && <div className="text-[10px] text-[#444] mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>

              {/* Budget bars */}
              <BarRow label={`Daily budget (${kalshi.budget.totalPct}% used)`} value={kalshi.budget.totalPct} max={100}
                color={kalshi.budget.totalPct >= 90 ? 'bg-red-500' : kalshi.budget.totalPct >= 70 ? 'bg-yellow-500' : 'bg-green-500'} suffix="%" />
              <BarRow label={`Weather Trader $${fmt(wt.spentCents/100)}/$${fmt(wt.budgetCents/100)}`} value={wt.budgetPct} max={100} color="bg-cyan-500" suffix="%" />
              <BarRow label={`Price Farmer $${fmt(pf.spentCents/100)}/$${fmt(pf.budgetCents/100)}`} value={pf.budgetPct} max={100} color="bg-purple-500" suffix="%" />

              {/* Weather trade log */}
              {wt.trades.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-[#555] mb-2 font-medium">Today&apos;s weather trades</p>
                  <div className="space-y-1">
                    {wt.trades.map((t, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-[#0d0d0d] rounded px-3 py-2 font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-sans font-bold ${t.side === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {t.side}
                          </span>
                          <span className="text-cyan-400 truncate">{t.ticker}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-2">
                          <span className="text-[#888] font-sans">${fmt(t.costUsd)}</span>
                          <span className="text-[#444] font-sans text-[10px]">
                            {new Date(t.ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : kalshi && !kalshi.ok ? (
            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2 flex items-center gap-2">
              <AlertCircle size={12} />
              {kalshi.error ?? 'State file not found'}
            </div>
          ) : (
            !loading && <p className="text-xs text-[#444]">No Kalshi data — bot may not have run today</p>
          )}
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
            { name: 'Kalshi Weather Bot v3', desc: 'NOAA → Kalshi daily high/low temp markets — 438 markets, 20 cities', status: 'active' },
            { name: 'Polymarket FastLoop v8', desc: 'ML trading bot — Simmer Markets API', status: 'active' },
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
        Auto-refreshes every 30s · Data from X API, Kalshi, NOAA, OpenClaw cron
      </p>
    </div>
  );
}
