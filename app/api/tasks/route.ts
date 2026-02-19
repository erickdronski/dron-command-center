import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.join(process.cwd(), 'public', 'data', 'tasks.json');

export async function GET() {
  try {
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ tasks: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    const newTask = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...body };
    tasks.push(newTask);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    return NextResponse.json({ task: newTask });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
