import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const wake    = searchParams.get('wake')    || '07:00';
  const sleep   = searchParams.get('sleep')   || '23:00';
  const coffees = searchParams.get('coffees') || '3';
  const source  = searchParams.get('source')  || 'coffee';

  const cachePath  = path.join(process.cwd(), 'public', 'data', 'caffeine.json');
  const scriptPath = path.join(process.cwd(), 'scripts', 'caffeine_bot.py');
  const cmd = `python3 "${scriptPath}" --wake ${wake} --sleep ${sleep} --coffees ${coffees} --source ${source} --json`;

  return new Promise<Response>((resolve) => {
    exec(cmd, { cwd: process.cwd() }, (error, stdout) => {
      if (error) {
        if (fs.existsSync(cachePath)) {
          try {
            const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            resolve(NextResponse.json({ ...cached, cached: true }));
            return;
          } catch {}
        }
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
        return;
      }
      try {
        resolve(NextResponse.json(JSON.parse(stdout)));
      } catch {
        resolve(NextResponse.json({ error: 'Parse error', raw: stdout }, { status: 500 }));
      }
    });
  });
}
