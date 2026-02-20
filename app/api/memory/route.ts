import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Works both locally and on Vercel — points to the deployed project root
const WORKSPACE = process.cwd();

function safePath(file: string): string | null {
  const resolved = path.resolve(WORKSPACE, file);
  if (!resolved.startsWith(WORKSPACE + path.sep) && resolved !== WORKSPACE) return null;
  return resolved;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (file) {
    const filePath = safePath(file);
    if (!filePath) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const stat = fs.statSync(filePath);
      return NextResponse.json({ content, size: stat.size, modified: stat.mtime.toISOString() });
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // List all memory-related files
  const files: { name: string; path: string; size: number; modified: string; category: string }[] = [];

  const addFile = (relPath: string, category: string) => {
    const abs = path.join(WORKSPACE, relPath);
    if (fs.existsSync(abs)) {
      try {
        const stat = fs.statSync(abs);
        files.push({ name: path.basename(relPath), path: relPath, size: stat.size, modified: stat.mtime.toISOString(), category });
      } catch { /* skip */ }
    }
  };

  // Core identity & soul files
  addFile('MEMORY.md', 'long-term');
  addFile('SOUL.md', 'identity');
  addFile('IDENTITY.md', 'identity');
  addFile('USER.md', 'identity');
  addFile('AGENTS.md', 'config');
  addFile('TOOLS.md', 'config');
  addFile('HEARTBEAT.md', 'config');
  addFile('BOOTSTRAP.md', 'config');

  // Daily memory logs
  const memoryDir = path.join(WORKSPACE, 'memory');
  if (fs.existsSync(memoryDir)) {
    try {
      const dailyFiles = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md') || f.endsWith('.json'))
        .sort()
        .reverse();
      for (const f of dailyFiles) {
        try {
          const stat = fs.statSync(path.join(memoryDir, f));
          files.push({ name: f, path: `memory/${f}`, size: stat.size, modified: stat.mtime.toISOString(), category: 'daily' });
        } catch { /* skip */ }
      }
    } catch { /* skip */ }
  }

  return NextResponse.json({ files });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) return NextResponse.json({ error: 'No file specified' }, { status: 400 });

  // Safety: only allow deleting files in memory/ subfolder or specific ones
  const DELETABLE_PREFIXES = ['memory/'];
  const DELETABLE_FILES = ['MEMORY.md', 'BOOTSTRAP.md'];

  const isDeletable =
    DELETABLE_PREFIXES.some(p => file.startsWith(p)) ||
    DELETABLE_FILES.includes(file);

  if (!isDeletable) {
    return NextResponse.json(
      { error: 'This file is protected and cannot be deleted from the UI' },
      { status: 403 }
    );
  }

  const filePath = safePath(file);
  if (!filePath) return NextResponse.json({ error: 'Invalid path' }, { status: 400 });

  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ ok: true, deleted: file });
  } catch {
    return NextResponse.json({ error: 'Could not delete file — filesystem may be read-only on this deployment' }, { status: 500 });
  }
}
