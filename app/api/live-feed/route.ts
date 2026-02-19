import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FEED_FILE = path.join(process.cwd(), 'public', 'data', 'feed.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(FEED_FILE, 'utf-8'));
    const entries = Array.isArray(data) ? data : [];
    return NextResponse.json({ entries: entries.slice(-100) });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entries = JSON.parse(fs.readFileSync(FEED_FILE, 'utf-8'));
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: body.type || 'THINKING',
      message: body.message || '',
      agent: body.agent || 'Dron Builder',
    };
    entries.push(newEntry);
    const trimmed = entries.slice(-500);
    fs.writeFileSync(FEED_FILE, JSON.stringify(trimmed, null, 2));
    return NextResponse.json({ ok: true, entry: newEntry });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
