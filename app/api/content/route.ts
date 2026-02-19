import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'public', 'data', 'content.json');

export async function GET() {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...body };
    content.push(newItem);
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    return NextResponse.json({ item: newItem });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
