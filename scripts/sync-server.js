#!/usr/bin/env node
/**
 * Sync Server — local HTTP server that syncs data files + pushes to GitHub
 * Run once: node scripts/sync-server.js
 * Dashboard "Sync" button opens: http://localhost:3001/sync
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const PORT = 3001;
const ROOT = path.join(__dirname, '..');

const GH_TOKEN = process.env.GITHUB_TOKEN || '';

function run(cmd, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: ROOT, env: { ...process.env, GITHUB_TOKEN: GH_TOKEN, ...extraEnv } }, (err, stdout, stderr) => {
      if (err) reject({ err, stdout, stderr });
      else resolve(stdout.trim());
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers (allow any origin)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (url.pathname !== '/sync') {
    res.writeHead(404);
    res.end('Not found. Use /sync');
    return;
  }

  const steps = [];
  const log = (msg) => { steps.push(msg); console.log(msg); };

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write(html('Syncing...', '<p class="syncing">Running sync script...</p>', true));

  try {
    log('▶ sync-data.sh');
    const syncOut = await run('bash scripts/sync-data.sh');
    log(syncOut);

    log('▶ git add');
    await run('git add public/data/');

    log('▶ git commit');
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    try {
      const commitOut = await run(`git commit -m "data: manual sync ${ts}"`);
      log(commitOut);
    } catch (e) {
      // Nothing to commit is fine
      log(e.stdout || 'Nothing to commit');
    }

    log('▶ api-push.py (GitHub REST API)');
    const pushOut = await run('python3 scripts/api-push.py');
    log(pushOut || 'Pushed via API.');

    const body = `
      <p class="ok">✓ Synced & pushed</p>
      <p class="note">Vercel is rebuilding — data will be live in ~60s.</p>
      <pre>${steps.join('\n')}</pre>
      <p class="close">You can close this tab.</p>
    `;
    res.end(html('Sync Complete', body, false));
  } catch (e) {
    const body = `
      <p class="err">✗ Error during sync</p>
      <pre>${JSON.stringify(e, null, 2)}\n\nSteps so far:\n${steps.join('\n')}</pre>
    `;
    res.end(html('Sync Failed', body, false));
  }
});

function html(title, body, spinner) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { background: #0a0a0a; color: #ccc; font-family: monospace; padding: 40px; max-width: 600px; margin: 0 auto; }
    h1 { color: #fff; font-size: 18px; margin-bottom: 24px; }
    pre { background: #111; border: 1px solid #222; padding: 16px; border-radius: 8px; font-size: 12px; white-space: pre-wrap; word-break: break-all; }
    .ok { color: #4ade80; font-weight: bold; font-size: 16px; }
    .err { color: #f87171; font-weight: bold; font-size: 16px; }
    .syncing { color: #facc15; }
    .note { color: #888; font-size: 13px; margin: 12px 0; }
    .close { color: #555; font-size: 12px; margin-top: 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid #333; border-top-color: #facc15; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px; }
  </style>
</head>
<body>
  <h1>${spinner ? '<span class="spinner"></span>' : ''}${title}</h1>
  ${body}
</body>
</html>`;
}

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n🔄 Sync server running at http://localhost:${PORT}/sync`);
  if (!GH_TOKEN) {
    console.log('   ⚠️  GITHUB_TOKEN not set — set it before syncing:');
    console.log('   GITHUB_TOKEN=ghp_... node scripts/sync-server.js\n');
  } else {
    console.log('   ✓ GITHUB_TOKEN set. Dashboard "Sync Data" button will trigger it.\n');
  }
});
