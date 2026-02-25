import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function readJSON(filePath: string) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function getCronJobs() {
  // Try local first, fallback to synced
  const localPath = path.join(process.env.HOME || '/Users/dron', '.openclaw', 'cron', 'jobs.json');
  const syncedPath = path.join(process.cwd(), 'public', 'data', 'cron_jobs.json');
  
  let data = await readJSON(localPath);
  if (!data) data = await readJSON(syncedPath);
  
  return data?.jobs || [];
}

function formatSchedule(job: any): string {
  const schedule = job.schedule;
  if (!schedule) return 'Unknown';
  
  if (schedule.kind === 'every') {
    const ms = schedule.everyMs;
    if (ms < 60000) return `Every ${ms / 1000}s`;
    if (ms < 3600000) return `Every ${Math.round(ms / 60000)}m`;
    if (ms < 86400000) return `Every ${Math.round(ms / 3600000)}h`;
    return `Every ${Math.round(ms / 86400000)}d`;
  }
  
  if (schedule.kind === 'cron') {
    const expr = schedule.expr;
    if (expr === '0 8 * * *') return 'Daily 8:00 AM';
    if (expr === '0 9 * * *') return 'Daily 9:00 AM';
    if (expr === '0 8,12,15,18,21 * * *') return '5x daily (8a,12p,3p,6p,9p)';
    if (expr === '0 9,12,15,18 * * *') return '4x daily (9a,12p,3p,6p)';
    if (expr === '0 */2 * * *') return 'Every 2 hours';
    if (expr === '30 */2 * * *') return 'Every 2 hours (:30)';
    if (expr === '0 9 * * 1') return 'Weekly (Mon 9am)';
    if (expr === '30 9 * * 1') return 'Weekly (Mon 9:30am)';
    return `${expr}`;
  }
  
  return 'Scheduled';
}

export async function GET() {
  try {
    const cronJobs = await getCronJobs();
    
    const jobs = cronJobs
      .filter((j: any) => j.enabled)
      .map((j: any) => {
        const state = j.state || {};
        return {
          id: j.id,
          name: j.name,
          schedule: formatSchedule(j),
          nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : null,
          lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : null,
          status: state.lastStatus || 'unknown',
          consecutiveErrors: state.consecutiveErrors || 0,
        };
      })
      .filter((j: any) => j.nextRun)
      .sort((a: any, b: any) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime());

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ jobs: [], error: String(error) });
  }
}
