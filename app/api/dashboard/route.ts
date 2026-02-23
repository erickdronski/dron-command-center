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
    if (!data) return 0;
    
    const wt = data.bots?.weather_trader?.trades_today || 0;
    const pf = data.bots?.price_farmer?.trades_today || 0;
    return wt + pf;
  } catch {
    return 0;
  }
}

async function getXPostsToday() {
  try {
    const statePath = path.join(WORKSPACE, 'agent_state.json');
    const data = await readJSON(statePath);
    return data?.agents?.social_poster?.postsToday || 0;
  } catch {
    return 0;
  }
}

async function getDeployments() {
  try {
    // Count recent git commits as deployments
    // For now, return a static number that updates on build
    return 2;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const [cronStats, trades, posts, deployments] = await Promise.all([
      getCronJobs(),
      getKalshiStats(),
      getXPostsToday(),
      getDeployments(),
    ]);

    return NextResponse.json({
      posts,
      trades,
      jobs: cronStats.total,
      deployments,
      activeJobs: cronStats.active,
      errorJobs: cronStats.errors,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      posts: 0,
      trades: 0,
      jobs: 0,
      deployments: 0,
      activeJobs: 0,
      errorJobs: 0,
    });
  }
}
