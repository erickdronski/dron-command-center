import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface WorkItem {
  id: string;
  title: string;
  status: 'active' | 'queued' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  estimatedTime: string;
  category: string;
  logs?: string[];
}

// Autonomous work queue
// This will be updated in real-time as I build
let workQueue: WorkItem[] = [
  {
    id: 'auto-2',
    title: 'Real-Time P&L Charts',
    status: 'queued',
    priority: 'high',
    progress: 0,
    estimatedTime: '1-2 hours',
    category: 'Analytics',
  },
  {
    id: 'auto-3',
    title: 'Discord Bi-Directional Sync',
    status: 'queued',
    priority: 'critical',
    progress: 0,
    estimatedTime: '1 hour',
    category: 'Infrastructure',
  },
  {
    id: 'auto-4',
    title: 'Smart Alert System',
    status: 'queued',
    priority: 'high',
    progress: 0,
    estimatedTime: '2 hours',
    category: 'Infrastructure',
  },
  {
    id: 'auto-5',
    title: 'Mobile Dashboard Optimization',
    status: 'queued',
    priority: 'medium',
    progress: 0,
    estimatedTime: '2-3 hours',
    category: 'UI/UX',
  },
  {
    id: 'completed-1',
    title: 'Weather Trading Bot',
    status: 'completed',
    priority: 'high',
    progress: 100,
    completedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    estimatedTime: '2-3 hours',
    category: 'Trading',
  },
];

export async function GET() {
  return NextResponse.json(workQueue);
}

// POST - Update work item (called by autonomous build process)
export async function POST(request: Request) {
  try {
    const update = await request.json();
    const { id, ...changes } = update;

    const item = workQueue.find(w => w.id === id);
    if (item) {
      Object.assign(item, changes);
    } else if (changes.status === 'queued') {
      // Add new item to queue
      workQueue.push({
        id: `auto-${Date.now()}`,
        ...changes,
      });
    }

    return NextResponse.json({ success: true, queue: workQueue });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
