import { NextResponse } from 'next/server';
import {
  getXFollowerCount,
  getXEngagementMetrics,
  getTradingPnL,
  getActivityFeed,
  getAlerts,
} from '../../../lib/data-sources';

export const dynamic = 'force-dynamic';

interface Alert {
  level: 'warning' | 'critical';
  message: string;
}

interface ActivityItem {
  time: string;
  message: string;
}

export async function GET() {
  try {
    // Fetch real data from all sources
    const [xFollowers, xMetrics, tradingData] = await Promise.all([
      getXFollowerCount(),
      getXEngagementMetrics(),
      getTradingPnL(),
    ]);

    // Hard-coded cron job status (will connect to OpenClaw API next)
    // Based on actual cron list output
    const cronJobs = [
      { 
        name: 'X Posts', 
        status: 'running', 
        nextRun: 'Every 3h',
        enabled: true,
        lastRun: 'Success',
      },
      { 
        name: 'X Engagement', 
        status: 'running', 
        nextRun: '5x/day peak hours',
        enabled: true,
        lastRun: 'Success',
      },
      {
        name: 'Weather Trader',
        status: 'idle',
        nextRun: 'Every 2h',
        enabled: true,
        lastRun: 'No markets found',
      },
      {
        name: 'Cron Monitor',
        status: 'running',
        nextRun: 'Every 30m',
        enabled: true,
        lastRun: 'Success',
      },
      {
        name: 'Weekly Analytics',
        status: 'idle',
        nextRun: 'Mon 9 AM',
        enabled: true,
        lastRun: 'Pending',
      },
    ];

    const alerts: Alert[] = [];
    const activity: ActivityItem[] = [
      { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), message: 'Dashboard loaded' },
    ];

    // Add budget warning if close to limit
    if (xMetrics && xMetrics.budgetSpent > 0.80) {
      alerts.push({
        level: 'warning',
        message: `X budget: $${xMetrics.budgetSpent.toFixed(2)}/$1.00 daily limit (${Math.round(xMetrics.budgetSpent * 100)}%)`,
      });
    }

    // Add trading alert if losing money
    if (tradingData.pnl24h < -5) {
      alerts.push({
        level: 'critical',
        message: `Trading loss: $${tradingData.pnl24h.toFixed(2)} in 24h`,
      });
    }

    // Get real activity feed
    const activityFeed = await getActivityFeed(10);

    const data = {
      trading: {
        polymarket: {
          active: tradingData.positions > 0,
          positions: tradingData.positions,
          pnl24h: tradingData.pnl24h,
          winRate: tradingData.winRate,
          totalTrades24h: tradingData.totalTrades,
        },
        weather: {
          active: false, // No weather markets in Feb
          edges: 0,
          pnl24h: 0,
        },
        combined: {
          pnl24h: tradingData.pnl24h, // Only Polymarket for now
        },
      },
      social: {
        followers: xFollowers?.count || 0,
        followerChange: xFollowers?.change24h || 0,
        postsToday: xMetrics?.postsToday || 0,
        repliesToday: xMetrics?.repliesToday || 0,
        totalActivity: xMetrics?.totalActivity || 0,
        totalPosts: 8, // Target posts per day
        engagementRate: xMetrics?.engagementRate || 0,
        budgetSpent: xMetrics?.budgetSpent || 0,
        dailyBudget: 1.00, // $1/day limit
      },
      system: {
        jobs: cronJobs,
        errors: 0, // TODO: Count from error logs
        totalJobs: cronJobs.length,
        activeJobs: cronJobs.filter(j => j.enabled).length,
      },
      activity: activityFeed,
      alerts,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
