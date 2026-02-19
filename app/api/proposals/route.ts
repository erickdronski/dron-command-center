import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface Proposal {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'inProgress' | 'completed';
  category: 'trading' | 'social' | 'infrastructure' | 'analytics';
  createdAt: string;
  approvedAt?: string;
  completedAt?: string;
  reasoning: string;
}

// In-memory storage (resets on deployment, but works for MVP)
// TODO: Replace with database (Vercel KV, Postgres, etc.)

// Helper to generate new proposals when old ones complete
function generateNewProposals(): Proposal[] {
  return [
    {
      id: '7',
      title: 'Real-Time P&L Chart on Dashboard',
      description: 'Add interactive chart showing trading P&L over time (24h, 7d, 30d views). Visualize win streaks, drawdowns, and profitability trends.',
      priority: 'medium',
      estimatedTime: '1-2 hours',
      status: 'pending',
      category: 'analytics',
      createdAt: new Date().toISOString(),
      reasoning: 'Visual data > numbers. Helps spot patterns, understand performance, make better decisions.',
    },
    {
      id: '8',
      title: 'Smart Alerts System',
      description: 'Auto-detect anomalies and opportunities: big price moves, unusual win/loss streaks, budget warnings, market inefficiencies. Push notifications to Discord.',
      priority: 'high',
      estimatedTime: '2-3 hours',
      status: 'pending',
      category: 'infrastructure',
      createdAt: new Date().toISOString(),
      reasoning: 'You shouldn\'t have to check the dashboard - it should tell YOU when something important happens.',
    },
    {
      id: '9',
      title: 'X Content Performance Analytics',
      description: 'Track which tweet types perform best (sports, trading, humor). Auto-optimize posting strategy based on engagement data.',
      priority: 'medium',
      estimatedTime: '2-3 hours',
      status: 'pending',
      category: 'social',
      createdAt: new Date().toISOString(),
      reasoning: 'Double down on what works. Data-driven content strategy = faster growth.',
    },
    {
      id: '10',
      title: 'Mobile Dashboard PWA',
      description: 'Convert dashboard to Progressive Web App - install on phone, push notifications, offline access. Check stats anywhere.',
      priority: 'low',
      estimatedTime: '3-4 hours',
      status: 'pending',
      category: 'infrastructure',
      createdAt: new Date().toISOString(),
      reasoning: 'Mobile-first world. Quick glances > opening laptop.',
    },
  ];
}

let proposals: Proposal[] = [
  {
    id: '1',
    title: 'Weather Trading Bot - NOAA Integration',
    description: 'Build automated weather trading system using NOAA forecasts vs Kalshi market odds. Auto-trade when edge >5%. Target: temperature & precipitation markets.',
    priority: 'high',
    estimatedTime: '2-3 hours',
    status: 'pending',
    category: 'trading',
    createdAt: new Date().toISOString(),
    reasoning: 'Low competition market, reliable data sources, proven edge potential. Cron job already scheduled every 2 hours.',
  },
  {
    id: '2',
    title: 'Discord Activity Feed Integration',
    description: 'Pull real messages from Discord channels (#polymarket-trades, #weather-trader, #x-posts) to show live activity feed on dashboard. Parse timestamps and content.',
    priority: 'medium',
    estimatedTime: '1-2 hours',
    status: 'pending',
    category: 'infrastructure',
    createdAt: new Date().toISOString(),
    reasoning: 'Essential for real-time monitoring. Currently showing mock data. Need message tool integration.',
  },
  {
    id: '3',
    title: 'Cron Job Live Status API',
    description: 'Connect dashboard to OpenClaw cron API for real-time job status, next run times, and error tracking. Replace hardcoded job list.',
    priority: 'high',
    estimatedTime: '30-60 min',
    status: 'pending',
    category: 'infrastructure',
    createdAt: new Date().toISOString(),
    reasoning: 'Critical for system monitoring. Currently hardcoded. Need live data for alerts.',
  },
  {
    id: '4',
    title: 'Cross-Platform Arbitrage Scanner',
    description: 'Monitor Kalshi, Polymarket, PredictIt for same events at different prices. Alert when spread >3%. Start with major political/crypto markets.',
    priority: 'medium',
    estimatedTime: '4-6 hours',
    status: 'pending',
    category: 'trading',
    createdAt: new Date().toISOString(),
    reasoning: 'Risk-free profit opportunities. Scales well. Low capital requirements.',
  },
  {
    id: '5',
    title: 'Daily Digest Cron Job',
    description: 'Automated 9 AM summary of all systems: trading P&L, X growth, errors, opportunities. Posts to #daily-digest and #general.',
    priority: 'medium',
    estimatedTime: '1-2 hours',
    status: 'pending',
    category: 'analytics',
    createdAt: new Date().toISOString(),
    reasoning: 'Glanceable daily overview. Reduces need to check multiple channels.',
  },
  {
    id: '6',
    title: 'Interactive Project Status Updates',
    description: 'Enable drag-drop on Kanban board, status change buttons, progress tracking. Two-way sync with actual bot deployment.',
    priority: 'low',
    estimatedTime: '2-3 hours',
    status: 'pending',
    category: 'infrastructure',
    createdAt: new Date().toISOString(),
    reasoning: 'Better UX for project management. Currently read-only.',
  },
];

// GET - List all proposals
export async function GET() {
  try {
    // If all initial proposals are completed/rejected, add new ones
    const activeProposals = proposals.filter(p => p.status === 'pending' || p.status === 'approved' || p.status === 'inProgress');
    
    if (activeProposals.length === 0) {
      const newProposals = generateNewProposals();
      proposals = [...proposals, ...newProposals];
    }
    
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error loading proposals:', error);
    return NextResponse.json({ error: 'Failed to load proposals' }, { status: 500 });
  }
}

// POST - Update proposal status (approve/reject/complete)
export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    const proposal = proposals.find(p => p.id === id);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Update status based on action
    switch (action) {
      case 'approve':
        proposal.status = 'approved';
        proposal.approvedAt = new Date().toISOString();
        // Send Discord notification to trigger build
        await notifyDiscord('approve', proposal);
        break;
      case 'reject':
        proposal.status = 'rejected';
        await notifyDiscord('reject', proposal);
        break;
      case 'start':
        proposal.status = 'inProgress';
        await notifyDiscord('start', proposal);
        break;
      case 'complete':
        proposal.status = 'completed';
        proposal.completedAt = new Date().toISOString();
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, proposal });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}

// Send notification to Discord when proposal is approved/started
async function notifyDiscord(action: string, proposal: Proposal) {
  const messages = {
    approve: `✅ **APPROVED:** ${proposal.title}\n\n@Dron - Erick approved this proposal. Start building now!\n\n**Priority:** ${proposal.priority.toUpperCase()}\n**Estimated Time:** ${proposal.estimatedTime}\n**Category:** ${proposal.category}\n\n**Description:** ${proposal.description}\n\n**Why:** ${proposal.reasoning}`,
    start: `⚡ **BUILDING:** ${proposal.title}\n\nDron is now building this. Estimated time: ${proposal.estimatedTime}`,
    reject: `❌ **REJECTED:** ${proposal.title}\n\nThis proposal was rejected.`,
  };

  const content = messages[action as keyof typeof messages];
  
  if (!content) return;

  try {
    // Send to #general channel where I'm watching
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: 'AI Workbench',
          avatar_url: 'https://em-content.zobj.net/thumbs/120/apple/354/sparkles_2728.png',
        }),
      });
    } else {
      // Fallback: log to console (you'll see it in Vercel logs)
      console.log('[PROPOSAL ACTION]', action, proposal.id, proposal.title);
    }
  } catch (error) {
    console.error('Failed to notify Discord:', error);
  }
}
