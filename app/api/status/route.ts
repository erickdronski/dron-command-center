import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const WORKSPACE = path.join(process.cwd(), '..');

async function readJSON(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Get real cron jobs from OpenClaw
async function getCronJobs() {
  try {
    // Read from cron jobs file directly
    const cronPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'cron', 'jobs.json');
    const data = await readJSON(cronPath);
    
    if (!data?.jobs) return [];
    
    return data.jobs
      .filter((j: any) => j.enabled)
      .map((j: any) => {
        const state = j.state || {};
        const lastRun = state.lastRunAtMs ? new Date(state.lastRunAtMs).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Never';
        const hasErrors = (state.consecutiveErrors || 0) > 0;
        
        return {
          name: j.name,
          status: hasErrors ? 'error' : (state.lastStatus === 'ok' ? 'running' : 'idle'),
          nextRun: j.schedule?.kind === 'every' 
            ? `Every ${Math.round(j.schedule.everyMs / 60000)}m`
            : j.schedule?.expr || 'Scheduled',
          enabled: true,
          lastRun: hasErrors ? `${state.consecutiveErrors} errors` : (state.lastStatus || 'Unknown'),
          consecutiveErrors: state.consecutiveErrors || 0,
        };
      })
      .slice(0, 10); // Top 10 jobs
  } catch {
    return [];
  }
}

// Get Kalshi trading data from shared state
async function getKalshiData() {
  try {
    const statePath = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');
    const data = await readJSON(statePath);
    
    if (!data) return { trades: 0, spent: 0, budget: 0 };
    
    const wt = data.bots?.weather_trader;
    const pf = data.bots?.price_farmer;
    
    return {
      trades: (wt?.trades_today || 0) + (pf?.trades_today || 0),
      spent: (data.total_spent_cents || 0) / 100,
      budget: (data.daily_limit_cents || 1800) / 100,
      weatherTrades: wt?.trades_today || 0,
      priceTrades: pf?.trades_today || 0,
    };
  } catch {
    return { trades: 0, spent: 0, budget: 0, weatherTrades: 0, priceTrades: 0 };
  }
}

// Get agent state
async function getAgentState() {
  try {
    const statePath = path.join(WORKSPACE, 'agent_state.json');
    return await readJSON(statePath);
  } catch {
    return null;
  }
}

// Get X bot state
async function getXState() {
  try {
    const statePath = path.join(WORKSPACE, 'x_bot_state.json');
    const data = await readJSON(statePath);
    
    if (!data) return null;
    
    return {
      postsToday: data.posts_today || 0,
      repliesToday: data.replies_today || data.engaged_tweets || 0,
      likesToday: data.likes_today || 0,
      budgetSpent: data.daily_budget_spent || 0,
      budgetLimit: data.daily_budget_limit || 1.0,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [cronJobs, kalshi, agentState, xState] = await Promise.all([
      getCronJobs(),
      getKalshiData(),
      getAgentState(),
      getXState(),
    ]);

    const social = agentState?.agents?.social_engagement;
    const poster = agentState?.agents?.social_poster;
    const trading = agentState?.agents?.trading;
    const monitor = agentState?.agents?.monitor;
    
    const totalJobs = cronJobs.length;
    const errorJobs = cronJobs.filter((j: any) => j.consecutiveErrors > 0);
    
    // Build activity feed
    const activity = [];
    
    if (kalshi.trades > 0) {
      activity.push({
        time: 'Today',
        message: `💰 Kalshi: ${kalshi.trades} trades, $${kalshi.spent.toFixed(2)} spent`,
      });
    }
    
    if (xState?.budgetSpent > 0) {
      activity.push({
        time: 'Today',
        message: `💸 X Budget: $${xState.budgetSpent.toFixed(2)} / $${xState.budgetLimit.toFixed(2)}`,
      });
    }
    
    if (social?.repliesToday > 0 || social?.likesToday > 0) {
      activity.push({
        time: 'Today',
        message: `💬 X Engagement: ${social.repliesToday || 0} replies, ${social.likesToday || 0} likes`,
      });
    }
    
    if (poster?.postsToday > 0) {
      activity.push({
        time: 'Today',
        message: `📝 X Posts: ${poster.postsToday} published`,
      });
    }
    
    activity.push({
      time: 'Now',
      message: errorJobs.length > 0 
        ? `⚠️ ${errorJobs.length} job${errorJobs.length > 1 ? 's' : ''} with errors`
        : '⚡ All systems operational',
    });

    // Build alerts
    const alerts = [];
    
    if (xState?.budgetSpent > 0.8) {
      alerts.push({
        level: 'warning',
        message: `X budget: $${xState.budgetSpent.toFixed(2)}/$${xState.budgetLimit.toFixed(2)} (${Math.round((xState.budgetSpent/xState.budgetLimit)*100)}%)`,
      });
    }
    
    if (errorJobs.length > 0) {
      alerts.push({
        level: 'warning',
        message: `${errorJobs.length} cron job${errorJobs.length > 1 ? 's' : ''} reporting errors`,
      });
    }

    const data = {
      trading: {
        kalshi: {
          active: kalshi.trades > 0,
          trades: kalshi.trades,
          spent: kalshi.spent,
          budget: kalshi.budget,
          weatherTrades: kalshi.weatherTrades,
          priceTrades: kalshi.priceTrades,
        },
        polymarket: {
          active: trading?.status === 'active',
          positions: trading?.openPositions || 0,
          tradesTotal: trading?.tradesTotal || 0,
        },
      },
      social: {
        followers: social?.followerCount || 0,
        postsToday: poster?.postsToday || 0,
        repliesToday: social?.repliesToday || 0,
        likesToday: social?.likesToday || 0,
        totalActivity: (social?.repliesToday || 0) + (social?.likesToday || 0),
        budgetSpent: xState?.budgetSpent || 0,
        budgetLimit: xState?.budgetLimit || 1.0,
      },
      system: {
        jobs: cronJobs,
        errors: errorJobs.length,
        totalJobs,
        activeJobs: totalJobs - errorJobs.length,
      },
      activity,
      alerts,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status', details: String(error) },
      { status: 500 }
    );
  }
}
