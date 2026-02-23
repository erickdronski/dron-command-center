import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ACTIONS_FILE = path.join(process.cwd(), 'public', 'data', 'actions.json');

export const dynamic = 'force-dynamic';

interface Action {
  id: string;
  type: string;
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actions = readActions();
    const action = actions.find(a => a.id === id);
    
    if (!action) {
      return NextResponse.json({ success: false, error: 'Action not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('Error reading action:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const actions = readActions();
    const index = actions.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Action not found' }, { status: 404 });
    }
    
    const action = actions[index];
    
    if (body.status) action.status = body.status;
    if (body.agent) action.agent = body.agent;
    if (body.result) action.result = body.result;
    if (body.log) {
      action.logs.push({
        time: new Date().toISOString(),
        level: body.log.level || 'info',
        message: body.log.message,
      });
    }
    
    action.updatedAt = new Date().toISOString();
    writeActions(actions);
    
    return NextResponse.json({ success: true, action });
  } catch (error) {
    console.error('Error updating action:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
