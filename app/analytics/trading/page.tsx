'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Percent, Activity } from 'lucide-react';

interface Trade {
  id: string;
  timestamp: string;
  ticker: string;
  title: string;
  side: 'yes' | 'no';
  entry_price: number;
  size: number;
  signal_type: string;
  edge: number;
  reason: string;
  exit_price?: number;
  exit_timestamp?: string;
  pnl?: number;
  status: 'open' | 'closed';
}

interface Portfolio {
  cash: number;
  positions_value: number;
  total_value: number;
  total_pnl: number;
  total_trades: number;
  win_count: number;
  loss_count: number;
}

interface DailyStats {
  date: string;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
}

export default function TradingPerformancePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load trades
      const tradesRes = await fetch('/data/sports_paper_trades.json');
      const tradesData = await tradesRes.json();
      setTrades(tradesData);

      // Load portfolio
      const portfolioRes = await fetch('/data/sports_paper_portfolio.json');
      const portfolioData = await portfolioRes.json();
      setPortfolio(portfolioData);

      // Calculate daily stats
      const stats = calculateDailyStats(tradesData);
      setDailyStats(stats);
    } catch (err) {
      console.error('Failed to load trading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyStats = (trades: Trade[]): DailyStats[] => {
    const byDate = new Map<string, { pnl: number; trades: number; wins: number; losses: number }>();
    
    trades.forEach(trade => {
      const date = trade.timestamp.split('T')[0];
      const existing = byDate.get(date) || { pnl: 0, trades: 0, wins: 0, losses: 0 };
      
      existing.trades++;
      if (trade.pnl !== undefined && trade.pnl !== null) {
        existing.pnl += trade.pnl;
        if (trade.pnl > 0) existing.wins++;
        else if (trade.pnl < 0) existing.losses++;
      }
      
      byDate.set(date, existing);
    });

    return Array.from(byDate.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const winRate = portfolio ? 
    portfolio.total_trades > 0 ? 
      ((portfolio.win_count / portfolio.total_trades) * 100).toFixed(1) : 
      '0.0' 
    : '0.0';

  const avgTrade = portfolio && portfolio.total_trades > 0 ?
    (portfolio.total_pnl / portfolio.total_trades).toFixed(2) :
    '0.00';

  const maxDrawdown = dailyStats.length > 0 ?
    Math.min(...dailyStats.map(d => d.pnl)).toFixed(2) :
    '0.00';

  const bestDay = dailyStats.length > 0 ?
    Math.max(...dailyStats.map(d => d.pnl)).toFixed(2) :
    '0.00';

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-[#555]">Loading trading data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-green-400" />
          <div>
            <h1 className="text-xl font-semibold text-white">Trading Performance</h1>
            <p className="text-xs text-[#555]">Live P&L · Win Rate · Daily Results</p>
          </div>
        </div>
        <div className="text-xs text-[#444]">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total P&L"
          value={portfolio ? `$${portfolio.total_pnl.toFixed(2)}` : '$0.00'}
          trend={portfolio && portfolio.total_pnl >= 0 ? 'up' : 'down'}
          color={portfolio && portfolio.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}
        />
        <MetricCard
          label="Win Rate"
          value={`${winRate}%`}
          sub={`${portfolio?.win_count || 0}W / ${portfolio?.loss_count || 0}L`}
          color={parseFloat(winRate) >= 50 ? 'text-green-400' : 'text-yellow-400'}
        />
        <MetricCard
          label="Total Trades"
          value={String(portfolio?.total_trades || 0)}
          sub={`Avg: $${avgTrade}`}
          color="text-white"
        />
        <MetricCard
          label="Portfolio Value"
          value={portfolio ? `$${portfolio.total_value.toFixed(2)}` : '$0.00'}
          sub={`Cash: $${portfolio?.cash.toFixed(2) || '0.00'}`}
          color="text-cyan-400"
        />
      </div>

      {/* P&L Chart */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#555]" />
            <h2 className="text-sm font-semibold text-white">Daily P&L</h2>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#555]">Best day: <span className="text-green-400">+${bestDay}</span></span>
            <span className="text-[#555]">Worst day: <span className="text-red-400">${maxDrawdown}</span></span>
          </div>
        </div>
        
        {dailyStats.length > 0 ? (
          <div className="space-y-2">
            {dailyStats.slice(-14).map((day) => (
              <div key={day.date} className="flex items-center gap-3">
                <div className="w-20 text-xs text-[#555]">{day.date.slice(5)}</div>
                <div className="flex-1 h-6 bg-[#1a1a1a] rounded overflow-hidden relative">
                  {day.pnl >= 0 ? (
                    <div 
                      className="h-full bg-green-500/60 rounded"
                      style={{ width: `${Math.min(100, (day.pnl / Math.max(...dailyStats.map(d => d.pnl))) * 100)}%` }}
                    />
                  ) : (
                    <div 
                      className="h-full bg-red-500/60 rounded absolute right-0"
                      style={{ width: `${Math.min(100, (Math.abs(day.pnl) / Math.max(...dailyStats.map(d => Math.abs(d.pnl)))) * 100)}%` }}
                    />
                  )}
                </div>
                <div className={`w-16 text-right text-xs font-medium ${day.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {day.pnl >= 0 ? '+' : ''}{day.pnl.toFixed(2)}
                </div>
                <div className="w-12 text-right text-xs text-[#444]">{day.trades}t</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#444]">No trading data available</div>
        )}
      </div>

      {/* Recent Trades */}
      <div className="bg-[#111] border border-[#222] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-[#555]" />
          <h2 className="text-sm font-semibold text-white">Recent Trades</h2>
        </div>
        
        {trades.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {trades.slice(-10).reverse().map((trade) => (
              <div key={trade.id} className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{trade.title}</div>
                  <div className="text-xs text-[#555]">{trade.ticker.slice(0, 20)}...</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-[#555]">
                    {trade.entry_price}¢ → {trade.exit_price || 'open'}
                  </div>
                  <div className={`text-sm font-medium w-16 text-right ${
                    trade.pnl === undefined ? 'text-[#555]' :
                    trade.pnl > 0 ? 'text-green-400' :
                    trade.pnl < 0 ? 'text-red-400' : 'text-[#555]'
                  }`}>
                    {trade.pnl !== undefined ? `${trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}` : '—'}
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    trade.status === 'closed' ? 'bg-[#1a1a1a] text-[#555]' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {trade.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#444]">No trades recorded</div>
        )}
      </div>

      {/* Screenshot Note */}
      <div className="mt-6 p-4 bg-[#1a1a1a] border border-[#222] rounded-lg">
        <div className="flex items-center gap-2 text-xs text-[#555]">
          <DollarSign size={14} />
          <span>Tip: Screenshot this page for LinkedIn posts. Use Cmd+Shift+4 to select area.</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  label, 
  value, 
  sub, 
  trend,
  color = 'text-white' 
}: { 
  label: string; 
  value: string; 
  sub?: string;
  trend?: 'up' | 'down';
  color?: string;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  
  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-4">
      <div className="text-xs text-[#555] uppercase tracking-wider mb-2">{label}</div>
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
