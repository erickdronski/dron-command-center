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

async function getAgentState() {
  try {
    const statePath = path.join(WORKSPACE, 'agent_state.json');
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
  
  // Determine agent type from cron job name
  if (name.includes('weather')) {
    return {
      emoji: '🌤️',
      name: 'Weather Trader',
      role: 'Kalshi Weather Bot',
      desc: 'NOAA + OpenWeather ensemble forecasting for temp markets',
      tags: ['Kalshi', 'Weather', 'ML'],
      color: 'border-cyan-500/30 bg-cyan-500/5',
      tagColor: 'bg-cyan-500/20 text-cyan-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('price') || name.includes('crypto')) {
    return {
      emoji: '💰',
      name: 'Price Farmer',
      role: 'Kalshi Crypto Trader',
      desc: '15-min crypto market trading with Kelly sizing',
      tags: ['Kalshi', 'Crypto', 'Trading'],
      color: 'border-yellow-500/30 bg-yellow-500/5',
      tagColor: 'bg-yellow-500/20 text-yellow-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('sports')) {
    return {
      emoji: '🏈',
      name: 'Sports Trader',
      role: 'Kalshi Sports Bot',
      desc: 'Sports market analysis and paper trading',
      tags: ['Kalshi', 'Sports', 'Analytics'],
      color: 'border-orange-500/30 bg-orange-500/5',
      tagColor: 'bg-orange-500/20 text-orange-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('politics')) {
    return {
      emoji: '🏛️',
      name: 'Politics Trader',
      role: 'Kalshi Politics Bot',
      desc: 'Political market analysis and polling divergence',
      tags: ['Kalshi', 'Politics', 'Polling'],
      color: 'border-indigo-500/30 bg-indigo-500/5',
      tagColor: 'bg-indigo-500/20 text-indigo-300',
      status: hasErrors ? 'error' : isActive ? 'active' : 'idle',
      lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : undefined,
      nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : undefined,
      consecutiveErrors: state.consecutiveErrors,
    };
  }
  
  if (name.includes('dronskierick') && name.includes('content')) {
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
  
  if (name.includes('dronskierick') && name.includes('engagement')) {
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
  
  return null; // Skip other jobs
}

export async function GET() {
  try {
    const [cronJobs, agentState] = await Promise.all([
      getCronJobs(),
      getAgentState(),
    ]);

    // Map cron jobs to agents
    const agents: Agent[] = cronJobs
      .filter((j: any) => j.enabled)
      .map(mapCronToAgent)
      .filter((a: Agent | null): a is Agent => a !== null);

    // Add special agents from agent_state that might not have cron jobs
    if (agentState?.agents) {
      const stateAgents = agentState.agents;
      
      // Add market detector if not already in list
      if (stateAgents.market_detector && !agents.find(a => a.name === 'Market Detector')) {
        const md = stateAgents.market_detector;
        agents.push({
          emoji: '🔍',
          name: 'Market Detector',
          role: 'Opportunity Scanner',
          desc: 'Scans for crypto market opportunities and signals',
          tags: ['Markets', 'Crypto', 'Signals'],
          color: 'border-blue-500/30 bg-blue-500/5',
          tagColor: 'bg-blue-500/20 text-blue-300',
          status: md.status === 'active' ? 'active' : 'idle',
          lastRun: md.lastRun,
        });
      }
    }

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
