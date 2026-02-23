import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ACTIONS_FILE = path.join(process.cwd(), 'public', 'data', 'actions.json');

export const dynamic = 'force-dynamic';

interface Action {
  id: string;
  type: 'code_change' | 'deploy' | 'rollback' | 'execute_task' | 'request_agent';
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requester: string;
  agent: string | null;
  result: string | null;
  logs: Array<{ time: string; level: 'info' | 'success' | 'warning' | 'error'; message: string }>;
}

function readActions(): Action[] {
  try {
    const data = fs.readFileSync(ACTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeActions(actions: Action[]) {
  fs.writeFileSync(ACTIONS_FILE, JSON.stringify(actions, null, 2));
}

export async function GET() {
  try {
    const actions = readActions();
    return NextResponse.json({ actions: actions.slice().reverse() });
  } catch (error) {
    console.error('Error reading actions:', error);
    return NextResponse.json({ actions: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const actions = readActions();
    
    const newAction: Action = {
      id: `action-${Date.now()}`,
      type: body.type || 'request_agent',
      title: body.title || 'New Action',
      description: body.description || '',
      status: body.type === 'deploy' || body.type === 'rollback' ? 'pending_approval' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requester: body.requester || 'Dron',
      agent: null,
      result: null,
      logs: [
        {
          time: new Date().toISOString(),
          level: 'info',
          message: `Action created: ${body.title || 'New Action'}`,
        },
      ],
    };
    
    actions.push(newAction);
    writeActions(actions);
    
    return NextResponse.json({ success: true, action: newAction });
  } catch (error) {
    console.error('Error creating action:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
