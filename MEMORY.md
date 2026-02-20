# MEMORY.md — Long-Term Memory

_Last updated: 2026-02-19_

---

## 👤 About Dron

- **Name:** Erick Dronski
- **Handle:** @DronskiErick (X/Twitter), sirdron (Discord)
- **Twitter User ID:** `1279926207618985984`
- **GitHub:** erickdronski
- **Timezone:** America/New_York (EST)
- **Discord ID:** 1473386371182891099

---

## 🎯 What Dron Is Building

An AI-first autonomous operation — treating AI agents like actual employees of a company he runs. Goals:
- **You steer, AI executes.** He wants to give full autonomy to the AI and just approve/reject decisions
- Building in public — content about AI tools, trading bots, and automation
- Growing X following aggressively
- Making money from Polymarket trading through AI-driven weather arbitrage

---

## 🤖 AI Systems & Bots

### Command Center (THIS)
- **Repo:** erickdronski/dron-command-center
- **Live:** https://dron-command-center.vercel.app
- **Stack:** Next.js 15, Tailwind CSS, Lucide React
- **Deploy:** Vercel (auto from GitHub push)
- **Pages:** Dashboard, Tasks, Content, Approvals, Calendar, Memory, Team, Office, Weather, Live Feed
- **Agent:** Dron Builder (🏗️) — that's me

### Polymarket Trading (FastLoop v8)
- **Path:** `../polymarket-fastloop/`
- **ML data:** `ml_data/training_data.json`
- **Strategy:** ML model predicting market outcomes
- **Status:** Active, optimization ongoing
- **API integration:** Simmer Markets SDK

### Weather Trading Bot
- **Skill:** polymarket-weather-trader v1.7.6
- **Strategy:** NOAA forecast → buy underpriced temperature buckets on Polymarket
- **Cities:** NYC (primary), Chicago, Seattle, Atlanta, Dallas, Miami
- **Entry threshold:** 15¢, Exit: 45¢, Max position: $2.00
- **Script:** `weather_trader.py --live --smart-sizing`
- **Inspired by:** gopfan2's $2M+ strategy
- **API:** Simmer Markets (`api.simmer.markets`)

### X (Twitter) Bot
- **File:** `../x_bot_state.json` (live state)
- **Follower history:** `../x_follower_history.json`
- **Bearer token:** stored in lib/data-sources.ts
- **Goals:** 10k followers, aggressive reply strategy targeting AI accounts
- **Cron:** Posts every 3h, engagement 5x/day at peak hours

---

## 🏗️ Infrastructure

### OpenClaw Setup
- **Config:** `~/.openclaw/openclaw.json`
- **Agents:** command-center (Dron Builder), value-engineering (Dron Analyst)
- **Channels:** Discord + Telegram
- **Telegram:** allowed from 1677680277
- **Discord guild:** 1473386868476219647
- **Command center channel:** 1474125586346676244
- **Value engineering channel:** 1474125704454078610

### Discord Channels
- general: 1473386869390835861
- x-posts: 1473394891290841223
- fastloop-ml: 1473394836521619748
- polymarket-trading: 1473394875826180096
- cron-jobs: 1473399326322458838
- weather-trading: 1473535322271907840
- high-priority-alerts: 1473823318317469736
- daily-digest: 1473823737563578532
- x-engagement: 1473823948193136844
- audience-growth: 1473824036466458726
- errors-debug: 1473824271775039699

### Models in Use
- **Primary:** anthropic/claude-sonnet-4-6
- **Fallbacks:** google/gemini-2.5-flash, openai/gpt-4o
- **Value Engineering:** anthropic/claude-opus-4-6

---

## 📊 Projects & Priorities

### Active (In Progress)
1. **Mission Control** — command center full rebuild (done Feb 19)
2. **Polymarket Weather Bot** — NOAA integration, real-time signals
3. **X follower growth** — reply strategy, engagement sprint

### Backlog
- YouTube content pipeline (AI tools video planned)
- FastLoop v8 ML model optimization
- Auto-deploy to Vercel on build success (needs GitHub token with `workflow` scope)

---

## 💡 Key Decisions & Preferences

- **Full autonomy:** Dron explicitly gave full autonomy over the command center codebase
- **File-based data:** No external DB — everything is JSON files in `/public/data/`
- **Approvals flow:** AI proposes → Dron approves/rejects via `/approvals` page
- **Live feed:** I log my actions to `/public/data/feed.json` so Dron can watch me work in real-time
- **Dark theme:** #0a0a0a bg, #111 cards, #222 borders — always
- **No markdown tables in Discord:** Use bullet lists

---

## 🔑 Session Notes (Feb 19, 2026)

- First session. Fresh workspace, no prior memory.
- Rebuilt entire command center into Mission Control (8 pages)
- Added NOAA weather page with Polymarket trading signals
- Fixed memory API + added delete functionality
- GitHub token missing `workflow` scope — needed for Actions deploy file
- BOOTSTRAP.md still exists — should delete it after filling memory

---

## 📝 Things to Remember

- Always post to `/api/live-feed` (or write to `public/data/feed.json`) when doing significant work so Dron can see it in real-time
- Vercel auto-deploys on every push to `main` (GitHub integration, not Actions)
- The `value-engineering` agent (Dron Analyst 💡) is separate — different channel, opus model
- When Dron says "pushed through X tasks" he means approved items in the Approvals queue
- Memory page API path safety: only serve files within the workspace directory
