import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE = path.join(process.cwd(), '..');

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

async function readJSON(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function getCronJobs() {
  try {
    const cronPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'cron', 'jobs.json');
    const data = await readJSON(cronPath);
    return data?.jobs || [];
  } catch {
    return [];
  }
}

async function getKalshiState() {
  try {
    const statePath = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');
    return await readJSON(statePath);
  } catch {
    return null;
  }
}

async function getXState() {
  try {
    const statePath = path.join(WORKSPACE, 'dronskierick_bot_state.json');
    return await readJSON(statePath);
  } catch {
    return null;
  }
}

// Map cron jobs to agents
function mapCronToAgent(cronJob: any): Agent | null {
  const name = cronJob.name.toLowerCase();
  const state = cronJob.state || {};
  const isActive = state.lastStatus === 'ok' && (state.consecutiveErrors || 0) === 0;
  const hasErrors = (state.consecutiveErrors || 0) > 0;
  
  if (name.includes('content') && name.includes('dronskierick')) {
    return {
      emoji: '✍️',
      name: 'Content Bot',
      role: '@DronskiErick Posts',
      desc: 'Business professional content for personal account',
      tags: ['X', 'Content', 'Personal'],
      color: 'border-sky-500/30 bg-sky-500/5',
      tagColor: 'bg-sky-500/20 text-sky-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('engagement') && name.includes('dronskierick')) {
    return {
      emoji: '💬',
      name: 'Engagement Bot',
      role: '@DronskiErick Replies',
      desc: 'Authentic engagement with startup/tech community',
      tags: ['X', 'Engagement', 'Growth'],
      color: 'border-pink-500/30 bg-pink-500/5',
      tagColor: 'bg-pink-500/20 text-pink-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('precision')) {
    return {
      emoji: '🎯',
      name: 'Precision Bot',
      role: '@PrecisionAlgos Brand',
      desc: 'Brand account for prediction markets and algorithms',
      tags: ['X', 'Brand', 'Algorithms'],
      color: 'border-violet-500/30 bg-violet-500/5',
      tagColor: 'bg-violet-500/20 text-violet-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('alert') || name.includes('monitor')) {
    return {
      emoji: '🚨',
      name: 'Alert Monitor',
      role: 'System Health',
      desc: 'Watches for trading losses, budget warnings, critical errors',
      tags: ['Monitoring', 'Alerts', 'System'],
      color: 'border-red-500/30 bg-red-500/5',
      tagColor: 'bg-red-500/20 text-red-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('budget')) {
    return {
      emoji: '💵',
      name: 'Budget Guard',
      role: 'Cost Control',
      desc: 'Monitors OpenAI spend and API budgets',
      tags: ['Budget', 'Costs', 'API'],
      color: 'border-emerald-500/30 bg-emerald-500/5',
      tagColor: 'bg-emerald-500/20 text-emerald-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('backup') || name.includes('cleanup')) {
    return {
      emoji: '💾',
      name: 'Backup Bot',
      role: 'Data Protection',
      desc: 'Silent workspace backups and session cleanup',
      tags: ['Backup', 'Maintenance', 'Silent'],
      color: 'border-gray-500/30 bg-gray-500/5',
      tagColor: 'bg-gray-500/20 text-gray-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('market') && name.includes('crypto')) {
    return {
      emoji: '🔍',
      name: 'Crypto Detector',
      role: 'Market Scanner',
      desc: 'Detects crypto market opportunities',
      tags: ['Crypto', 'Markets', 'Signals'],
      color: 'border-blue-500/30 bg-blue-500/5',
      tagColor: 'bg-blue-500/20 text-blue-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  return null;
}

export async function GET() {
  try {
    const [cronJobs, kalshiState, xState] = await Promise.all([
      getCronJobs(),
      getKalshiState(),
      getXState(),
    ]);

    const agents: Agent[] = [];

    // Add Kalshi bots from shared state
    if (kalshiState?.bots) {
      const { price_farmer, weather_trader, sports_trader } = kalshiState.bots;
      
      if (price_farmer) {
        agents.push({
          emoji: '💰',
          name: 'Price Farmer',
          role: 'Kalshi Crypto Trader',
          desc: '15-min crypto market trading with Kelly sizing',
          tags: ['Kalshi', 'Crypto', 'Trading'],
          color: 'border-yellow-500/30 bg-yellow-500/5',
          tagColor: 'bg-yellow-500/20 text-yellow-300',
          status: price_farmer.trades_today > 0 ? 'active' : 'idle',
          lastRun: price_farmer.last_trade,
          metrics: {
            tradesToday: price_farmer.trades_today,
            spent: `$${(price_farmer.daily_spent_cents / 100).toFixed(2)}`,
          },
        });
      }
      
      if (weather_trader) {
        agents.push({
          emoji: '🌤️',
          name: 'Weather Trader',
          role: 'Kalshi Weather Bot',
          desc: 'NOAA + OpenWeather ensemble forecasting for temp markets',
          tags: ['Kalshi', 'Weather', 'ML'],
          color: 'border-cyan-500/30 bg-cyan-500/5',
          tagColor: 'bg-cyan-500/20 text-cyan-300',
          status: weather_trader.trades_today > 0 ? 'active' : 'idle',
          lastRun: weather_trader.last_trade,
          metrics: {
            tradesToday: weather_trader.trades_today,
            spent: `$${(weather_trader.daily_spent_cents / 100).toFixed(2)}`,
          },
        });
      }
      
      if (sports_trader) {
        agents.push({
          emoji: '🏈',
          name: 'Sports Trader',
          role: 'Kalshi Sports Bot',
          desc: 'Sports market analysis and paper trading',
          tags: ['Kalshi', 'Sports', 'Analytics'],
          color: 'border-orange-500/30 bg-orange-500/5',
          tagColor: 'bg-orange-500/20 text-orange-300',
          status: sports_trader.trades_today > 0 ? 'active' : 'idle',
          lastRun: sports_trader.last_trade,
          metrics: {
            tradesToday: sports_trader.trades_today,
            spent: `$${(sports_trader.daily_spent_cents / 100).toFixed(2)}`,
          },
        });
      }
    }

    // Add X engagement bot from state
    if (xState) {
      agents.push({
        emoji: '💬',
        name: 'X Engagement',
        role: 'Community Engagement',
        desc: 'Likes, replies, and authentic engagement',
        tags: ['X', 'Engagement', 'Growth'],
        color: 'border-pink-500/30 bg-pink-500/5',
        tagColor: 'bg-pink-500/20 text-pink-300',
        status: 'active',
        lastRun: xState.last_run,
        metrics: {
          likesToday: xState.daily_stats?.total_likes || 0,
          repliesToday: xState.daily_stats?.total_replies || 0,
          spent: `$${(xState.daily_stats?.total_spent || 0).toFixed(3)}`,
        },
      });
    }

    // Map cron jobs to agents
    cronJobs
      .filter((j: any) => j.enabled)
      .forEach((job: any) => {
        const agent = mapCronToAgent(job);
        if (agent) agents.push(agent);
      });

    // Sort: active first, then by name
    agents.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (b.status === 'active' && a.status !== 'active') return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Team API error:', error);
    return NextResponse.json({ agents: [], error: String(error) });
  }
}
