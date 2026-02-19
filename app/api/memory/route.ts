import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/dron/.openclaw/workspace/dron-command-center';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (file) {
    // Read specific file - security: only allow files within workspace
    const filePath = path.join(WORKSPACE, file);
    if (!filePath.startsWith(WORKSPACE)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return NextResponse.json({ content });
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // List memory files
  const files: { name: string; path: string; size: number; modified: string }[] = [];

  // Add MEMORY.md if exists
  const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memoryMd)) {
    const stat = fs.statSync(memoryMd);
    files.push({ name: 'MEMORY.md', path: 'MEMORY.md', size: stat.size, modified: stat.mtime.toISOString() });
  }

  // Add daily memory files
  const memoryDir = path.join(WORKSPACE, 'memory');
  if (fs.existsSync(memoryDir)) {
    const dailyFiles = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md')).sort().reverse();
    for (const f of dailyFiles) {
      const stat = fs.statSync(path.join(memoryDir, f));
      files.push({ name: f, path: `memory/${f}`, size: stat.size, modified: stat.mtime.toISOString() });
    }
  }

  return NextResponse.json({ files });
}
