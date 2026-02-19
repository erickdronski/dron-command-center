import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BuildLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface BuildStatus {
  proposalId: string | null;
  proposalTitle: string | null;
  status: 'idle' | 'building' | 'blocked' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt: string | null;
  estimatedCompletion: string | null;
  blockers: Array<{
    type: string;
    message: string;
    needsUserAction: boolean;
  }>;
  currentTask: string | null;
  logs: BuildLog[];
  filesCreated: string[];
  filesModified: string[];
}

// Global build status (in-memory for now)
let buildStatus: BuildStatus = {
  proposalId: null,
  proposalTitle: null,
  status: 'idle',
  progress: 0,
  startedAt: null,
  estimatedCompletion: null,
  blockers: [],
  currentTask: null,
  logs: [],
  filesCreated: [],
  filesModified: [],
};

export async function GET() {
  return NextResponse.json(buildStatus);
}

// POST - Update build status (called by Dron during build process)
export async function POST(request: Request) {
  try {
    const update = await request.json();
    
    // Merge update into current status
    buildStatus = {
      ...buildStatus,
      ...update,
      logs: update.logs ? [...buildStatus.logs, ...update.logs].slice(-50) : buildStatus.logs, // Keep last 50
    };

    return NextResponse.json({ success: true, status: buildStatus });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE - Clear build status
export async function DELETE() {
  buildStatus = {
    proposalId: null,
    proposalTitle: null,
    status: 'idle',
    progress: 0,
    startedAt: null,
    estimatedCompletion: null,
    blockers: [],
    currentTask: null,
    logs: [],
    filesCreated: [],
    filesModified: [],
  };
  
  return NextResponse.json({ success: true });
}
