import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Read from public/data (synced at build time or runtime)
async function readJSON(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function getCronJobs() {
  // Try local cron file first, fallback to synced data
  const localPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'cron', 'jobs.json');
  const syncedPath = path.join(process.cwd(), 'public', 'data', 'cron_jobs.json');
  
  let data = await readJSON(localPath);
  if (!data) data = await readJSON(syncedPath);
  
  const jobs = data?.jobs || [];
  return {
    total: jobs.filter((j: any) => j.enabled).length,
    active: jobs.filter((j: any) => j.enabled && (j.state?.consecutiveErrors || 0) === 0).length,
    errors: jobs.filter((j: any) => j.enabled && (j.state?.consecutiveErrors || 0) > 0).length,
  };
}

async function getKalshiStats() {
  // Try local first, fallback to synced
  const localPath = path.join(process.cwd(), 'ml_data', 'kalshi_shared_state.json');
  const syncedPath = path.join(process.cwd(), 'public', 'data', 'kalshi_shared_state.json');
  
  let data = await readJSON(localPath);
  if (!data) data = await readJSON(syncedPath);
  
  if (!data) return { trades: 0, spent: 0 };
  
  const wt = data.bots?.weather_trader?.trades_today || 0;
  const pf = data.bots?.price_farmer?.trades_today || 0;
  const st = data.bots?.sports_trader?.trades_today || 0;
  
  return {
    trades: wt + pf + st,
    spent: (data.total_spent_cents || 0) / 100,
  };
}

async function getXPostsTotal() {
  try {
    const postsPath = path.join(process.cwd(), 'public', 'data', 'x_posts.json');
    const posts = await readJSON(postsPath) || [];
    return Array.isArray(posts) ? posts.length : 0;
  } catch {
    return 0;
  }
}

async function getXEngagement() {
  // Try local first, fallback to synced
  const localPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'workspace', 'dronskierick_bot_state.json');
  const syncedPath = path.join(process.cwd(), 'public', 'data', 'dronskierick_bot_state.json');
  
  let data = await readJSON(localPath);
  if (!data) data = await readJSON(syncedPath);
  
  if (data?.daily_stats) {
    return {
      likes: data.daily_stats.total_likes || 0,
      replies: data.daily_stats.total_replies || 0,
      spent: data.daily_stats.total_spent || 0,
    };
  }
  
  return { likes: 0, replies: 0, spent: 0 };
}

export async function GET() {
  try {
    const [cronStats, kalshi, posts, xEngagement] = await Promise.all([
      getCronJobs(),
      getKalshiStats(),
      getXPostsTotal(),
      getXEngagement(),
    ]);

    return NextResponse.json({
      posts,
      trades: kalshi.trades,
      kalshiSpent: kalshi.spent,
      jobs: cronStats.total,
      deployments: 2,
      activeJobs: cronStats.active,
      errorJobs: cronStats.errors,
      xEngagement,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      posts: 0, trades: 0, kalshiSpent: 0, jobs: 0, deployments: 0,
      activeJobs: 0, errorJobs: 0, xEngagement: { likes: 0, replies: 0, spent: 0 },
    });
  }
}
