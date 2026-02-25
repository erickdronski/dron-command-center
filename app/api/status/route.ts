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
    const cronPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'cron', 'jobs.json');
    const data = await readJSON(cronPath);
    
    if (!data?.jobs) return [];
    
    return data.jobs
      .filter((j: any) => j.enabled)
      .map((j: any) => {
        const state = j.state || {};
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
      .slice(0, 10);
  } catch {
    return [];
  }
}

// Get Kalshi data from shared state
async function getKalshiData() {
  try {
    const statePath = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');
    const data = await readJSON(statePath);
    
    if (!data) return { trades: 0, spent: 0, budget: 24, weatherTrades: 0, priceTrades: 0, sportsTrades: 0 };
    
    const wt = data.bots?.weather_trader;
    const pf = data.bots?.price_farmer;
    const st = data.bots?.sports_trader;
    
    return {
      trades: (wt?.trades_today || 0) + (pf?.trades_today || 0) + (st?.trades_today || 0),
      spent: (data.total_spent_cents || 0) / 100,
      budget: (data.daily_limit_cents || 2400) / 100,
      weatherTrades: wt?.trades_today || 0,
      priceTrades: pf?.trades_today || 0,
      sportsTrades: st?.trades_today || 0,
    };
  } catch {
    return { trades: 0, spent: 0, budget: 24, weatherTrades: 0, priceTrades: 0, sportsTrades: 0 };
  }
}

// Get X data from dronskierick_bot_state.json (the real source)
async function getXData() {
  try {
    // Try the new bot state file first
    const statePath = path.join(WORKSPACE, 'dronskierick_bot_state.json');
    const data = await readJSON(statePath);
    
    if (data?.daily_stats) {
      return {
        postsToday: 0, // Will be calculated from x_posts.json
        repliesToday: data.daily_stats.total_replies || 0,
        likesToday: data.daily_stats.total_likes || 0,
        budgetSpent: data.daily_stats.total_spent || 0,
        budgetLimit: 1.0,
      };
    }
    
    // Fallback to old x_bot_state.json
    const xStatePath = path.join(WORKSPACE, 'x_bot_state.json');
    const xData = await readJSON(xStatePath);
    
    if (xData) {
      const replies = xData.replies_today;
      return {
        postsToday: xData.posts_today || 0,
        repliesToday: Array.isArray(replies) ? replies.length : (replies || 0),
        likesToday: xData.likes_today || 0,
        budgetSpent: xData.daily_budget_spent || 0,
        budgetLimit: xData.daily_budget_limit || 1.0,
      };
    }
    
    return null;
  } catch {
    return null;
  }
}

// Get today's X posts count
async function getXPostsToday() {
  try {
    const postsPath = path.join(process.cwd(), 'public', 'data', 'x_posts.json');
    const posts = await readJSON(postsPath) || [];
    const today = new Date().toDateString();
    return posts.filter((p: any) => new Date(p.timestamp).toDateString() === today).length;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const [cronJobs, kalshi, xData, postsToday] = await Promise.all([
      getCronJobs(),
      getKalshiData(),
      getXData(),
      getXPostsToday(),
    ]);

    const totalJobs = cronJobs.length;
    const errorJobs = cronJobs.filter((j: any) => j.consecutiveErrors > 0);
    
    // Build activity feed from real data
    const activity = [];
    
    if (kalshi.trades > 0) {
      activity.push({
        time: 'Today',
        message: `💰 Kalshi: ${kalshi.trades} trades, $${kalshi.spent.toFixed(2)} spent`,
      });
    }
    
    if (xData?.budgetSpent && xData.budgetSpent > 0) {
      activity.push({
        time: 'Today',
        message: `💸 X Budget: $${xData.budgetSpent.toFixed(3)} / $${xData.budgetLimit.toFixed(2)}`,
      });
    }
    
    if (xData && (xData.repliesToday > 0 || xData.likesToday > 0)) {
      activity.push({
        time: 'Today',
        message: `💬 X Engagement: ${xData.repliesToday} replies, ${xData.likesToday} likes`,
      });
    }
    
    if (postsToday > 0) {
      activity.push({
        time: 'Today',
        message: `📝 X Posts: ${postsToday} published`,
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
    
    if (xData && xData.budgetSpent > 0.8) {
      alerts.push({
        level: 'warning',
        message: `X budget: $${xData.budgetSpent.toFixed(2)}/$${xData.budgetLimit.toFixed(2)} (${Math.round((xData.budgetSpent/xData.budgetLimit)*100)}%)`,
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
          sportsTrades: kalshi.sportsTrades,
        },
        polymarket: {
          active: false,
          positions: 0,
          tradesTotal: 0,
        },
      },
      social: {
        postsToday,
        repliesToday: xData?.repliesToday ?? 0,
        likesToday: xData?.likesToday ?? 0,
        totalActivity: (xData?.repliesToday ?? 0) + (xData?.likesToday ?? 0),
        budgetSpent: xData?.budgetSpent ?? 0,
        budgetLimit: xData?.budgetLimit ?? 1.0,
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
