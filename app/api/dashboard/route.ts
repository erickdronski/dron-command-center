import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const WORKSPACE = path.join(process.cwd(), '..');

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
    const jobs = data?.jobs || [];
    return {
      total: jobs.filter((j: any) => j.enabled).length,
      active: jobs.filter((j: any) => j.enabled && (j.state?.consecutiveErrors || 0) === 0).length,
      errors: jobs.filter((j: any) => j.enabled && (j.state?.consecutiveErrors || 0) > 0).length,
    };
  } catch {
    return { total: 0, active: 0, errors: 0 };
  }
}

async function getKalshiStats() {
  try {
    const statePath = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');
    const data = await readJSON(statePath);
    if (!data) return { trades: 0, spent: 0 };
    
    const wt = data.bots?.weather_trader?.trades_today || 0;
    const pf = data.bots?.price_farmer?.trades_today || 0;
    const st = data.bots?.sports_trader?.trades_today || 0;
    
    return {
      trades: wt + pf + st,
      spent: (data.total_spent_cents || 0) / 100,
    };
  } catch {
    return { trades: 0, spent: 0 };
  }
}

async function getXPostsToday() {
  try {
    // Read from x_posts.json and count today's posts
    const postsPath = path.join(process.cwd(), 'public', 'data', 'x_posts.json');
    const posts = await readJSON(postsPath) || [];
    
    const today = new Date().toDateString();
    return posts.filter((p: any) => new Date(p.timestamp).toDateString() === today).length;
  } catch {
    return 0;
  }
}

async function getXEngagement() {
  try {
    // Try dronskierick_bot_state first, fallback to x_bot_state
    const statePath = path.join(WORKSPACE, 'dronskierick_bot_state.json');
    const data = await readJSON(statePath);
    
    if (data?.daily_stats) {
      return {
        likes: data.daily_stats.total_likes || 0,
        replies: data.daily_stats.total_replies || 0,
        spent: data.daily_stats.total_spent || 0,
      };
    }
    
    // Fallback to x_bot_state
    const xStatePath = path.join(WORKSPACE, 'x_bot_state.json');
    const xData = await readJSON(xStatePath);
    
    return {
      likes: xData?.likes_today || 0,
      replies: xData?.replies_today || 0,
      spent: xData?.daily_budget_spent || 0,
    };
  } catch {
    return { likes: 0, replies: 0, spent: 0 };
  }
}

export async function GET() {
  try {
    const [cronStats, kalshi, posts, xEngagement] = await Promise.all([
      getCronJobs(),
      getKalshiStats(),
      getXPostsToday(),
      getXEngagement(),
    ]);

    return NextResponse.json({
      posts,
      trades: kalshi.trades,
      kalshiSpent: kalshi.spent,
      jobs: cronStats.total,
      deployments: 2, // Static for now
      activeJobs: cronStats.active,
      errorJobs: cronStats.errors,
      xEngagement,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      posts: 0,
      trades: 0,
      kalshiSpent: 0,
      jobs: 0,
      deployments: 0,
      activeJobs: 0,
      errorJobs: 0,
      xEngagement: { likes: 0, replies: 0, spent: 0 },
    });
  }
}
